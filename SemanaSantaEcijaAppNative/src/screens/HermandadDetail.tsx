import React, { useMemo, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image, ImageBackground, Platform, Linking, Alert } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import type { DetailRouteProp } from '@mobile/types/navigation'
import { useHermandades } from '@mobile/context/HermandadesContext'
import { Ionicons } from '@expo/vector-icons'

import { colors } from '@mobile/theme/colors'
import { LinearGradient } from 'expo-linear-gradient'
import { getEscudoSource } from '@mobile/utils/escudos'
import { getHeaderSource } from '@mobile/utils/headers'
import { parseNazarenoColors } from '@mobile/utils/nazarenoColors'

import AlertBanner from '@mobile/components/AlertBanner'
import UserGalleryModal from '@mobile/components/UserGalleryModal'
import NazarenoIcon from '@mobile/components/NazarenoIcon'

export default function HermandadDetail() {
  const route = useRoute<DetailRouteProp>()
  const navigation = useNavigation()
  const { getHermandadById, toggleFavorite, loading, incidencias } = useHermandades()
  const id = route.params?.id
  const [expandedDesc, setExpandedDesc] = useState(false)
  const [galleryVisible, setGalleryVisible] = useState(false)
  if (loading) return <Text style={styles.statusMsg}>Cargando...</Text>
  if (typeof id !== 'number') return <Text style={styles.statusMsg}>Sin parámetro</Text>
  const hermandad = getHermandadById(id)
  if (!hermandad) return <Text style={styles.statusMsg}>No encontrada</Text>

  // Verificar si hay incidencia activa para esta hermandad
  const incidencia = incidencias[id.toString()]
  const showAlert = incidencia && incidencia.isActive

  const headerSource = useMemo(() => {
    const imageIdentifier = hermandad.mainImage
    if (!imageIdentifier) return null

    // 1. Remote URL check (http/https)
    const isRemote = imageIdentifier.startsWith('http://') || imageIdentifier.startsWith('https://')
    if (isRemote) {
      return { uri: imageIdentifier }
    }

    // 2. Local Asset lookup
    const localAsset = getHeaderSource(imageIdentifier)
    if (localAsset) {
      return localAsset
    }

    // 3. Fallback / Unresolved
    // If it's not a URL and not in our local map, it's an invalid identifier
    console.warn(`[HermandadDetail] Could not resolve image identifier: "${imageIdentifier}"`)
    return null
  }, [hermandad.mainImage])

  const duration = useMemo(() => {
    if (!hermandad.exitTime || !hermandad.entryTime) return null
    const [eh, em] = hermandad.exitTime.split(':').map(Number)
    const [ih, im] = hermandad.entryTime.split(':').map(Number)
    // Considerar paso de medianoche
    let start = eh * 60 + em
    let end = ih * 60 + im
    if (end < start) end += 24 * 60
    const diff = end - start
    const h = Math.floor(diff / 60)
    const m = diff % 60
    return `${h}h ${m.toString().padStart(2, '0')}m`
  }, [hermandad.exitTime, hermandad.entryTime])

  const shortDescription = useMemo(() => {
    if (!hermandad.description) return ''
    if (expandedDesc) return hermandad.description
    if (hermandad.description.length < 260) return hermandad.description
    return hermandad.description.slice(0, 260) + '…'
  }, [expandedDesc, hermandad.description])

  const colorBadges = useMemo(() => {
    const base = hermandad.colors?.toLowerCase() || ''
    const map: Record<string, string> = {
      blanco: '#ffffff', blanca: '#ffffff', blancos: '#ffffff',
      morado: '#4b0082', morada: '#4b0082', morados: '#4b0082',
      negro: '#000000', negra: '#000000', negros: '#000000',
      rojo: '#b40000', roja: '#b40000', rojos: '#b40000',
      azul: '#003c8f', azulmarino: '#001f3f',
      dorado: '#d4af37', oro: '#d4af37'
    }
    const tokens = Object.keys(map).filter(k => base.includes(k))
    const unique = Array.from(new Set(tokens.map(t => map[t])))
    return unique
  }, [hermandad.colors])

  const nazarenoColors = useMemo(() => {
    const tunicaText = hermandad.pasos?.[0]?.tunica_nazarenos || ''
    return parseNazarenoColors(hermandad.colors, tunicaText)
  }, [hermandad.colors, hermandad.pasos])

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero */}
        <View style={styles.heroWrapper}>
          {headerSource ? (
            <View style={styles.heroContainer}>
              {/* Background blurred layer to fill space */}
              <Image
                source={headerSource}
                style={[StyleSheet.absoluteFill, { opacity: 0.6 }]}
                blurRadius={Platform.OS === 'android' ? 5 : 10}
                resizeMode="cover"
              />
              {/* Foreground image: fully visible */}
              <Image
                source={headerSource}
                style={styles.heroImg}
              />
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
                style={styles.heroGradient}
              />
              <View style={styles.heroTopBar}>
                <TouchableOpacity accessibilityLabel="Volver" onPress={() => navigation.goBack()} style={styles.circleBtn}>
                  <Ionicons name="arrow-back" size={24} color={colors.textLight} />
                </TouchableOpacity>
                <View style={styles.heroTopRight}>
                  <TouchableOpacity accessibilityLabel="Mi galería de fotos" onPress={() => setGalleryVisible(true)} style={styles.galleryPillBtn}>
                    <Ionicons name="camera-outline" size={18} color={colors.textLight} />
                    <Text style={styles.galleryPillText}>Galería</Text>
                  </TouchableOpacity>
                  <TouchableOpacity accessibilityLabel={hermandad.isFavorite ? 'Quitar de favoritas' : 'Añadir a favoritas'} onPress={() => toggleFavorite(hermandad.id)} style={styles.circleBtn}>
                    <Ionicons name={hermandad.isFavorite ? 'star' : 'star-outline'} size={24} color={colors.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.heroBottom}>
                <Text style={styles.heroTitle}>{hermandad.name}</Text>
                <View style={[styles.dayChip, { borderColor: colors.secondary }]}>
                  <Text style={styles.dayChipText}>{hermandad.day}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={[styles.heroContainer, styles.heroPlaceholder]}>
              <LinearGradient colors={['rgba(29,0,51,1)', 'rgba(29,0,51,0.6)', 'rgba(29,0,51,1)']} style={styles.heroGradient} />
              <View style={styles.heroTopBar}>
                <TouchableOpacity accessibilityLabel="Volver" onPress={() => navigation.goBack()} style={styles.circleBtn}>
                  <Ionicons name="arrow-back" size={24} color={colors.textLight} />
                </TouchableOpacity>
                <View style={styles.heroTopRight}>
                  <TouchableOpacity accessibilityLabel="Mi galería de fotos" onPress={() => setGalleryVisible(true)} style={styles.galleryPillBtn}>
                    <Ionicons name="camera-outline" size={18} color={colors.textLight} />
                    <Text style={styles.galleryPillText}>Galería</Text>
                  </TouchableOpacity>
                  <TouchableOpacity accessibilityLabel={hermandad.isFavorite ? 'Quitar de favoritas' : 'Añadir a favoritas'} onPress={() => toggleFavorite(hermandad.id)} style={styles.circleBtn}>
                    <Ionicons name={hermandad.isFavorite ? 'star' : 'star-outline'} size={24} color={colors.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.heroCenterPlaceholder}>
                <Ionicons name="images-outline" size={48} color={'rgba(255,255,255,0.5)'} />
                <Text style={styles.placeholderText}>Imagen pendiente</Text>
              </View>
              <View style={styles.heroBottom}>
                <Text style={styles.heroTitle}>{hermandad.name}</Text>
                <View style={styles.dayChip}><Text style={styles.dayChipText}>{hermandad.day}</Text></View>
              </View>
            </View>
          )}
          {/* Nazareno con colores de la hermandad */}
          <View style={styles.nazarenoContainer}>
            <NazarenoIcon
              tunicColor={nazarenoColors.tunic}
              hoodColor={nazarenoColors.hood}
              capeColor={nazarenoColors.cape}
              size={44}
            />
          </View>
          {/* Escudo superpuesto */}
          <View style={styles.shieldContainer}>
            {(() => {
              const escudoSource = getEscudoSource(hermandad.shieldUrl)
              return escudoSource ? (
                <Image
                  source={escudoSource}
                  style={styles.shield}
                  resizeMode="contain"
                />
              ) : (
                <View style={[styles.shield, styles.shieldPlaceholder]}>
                  <Text style={styles.shieldLetter}>{hermandad.name.charAt(0)}</Text>
                </View>
              )
            })()}
          </View>
        </View>

        {showAlert && incidencia && (
          <AlertBanner
            type={incidencia.type}
            title={incidencia.title}
            message={incidencia.message}
          />
        )}

        {/* Horarios */}
        <SectionCard title="Horarios" icon="time-outline">
          <View style={styles.rowBetween}>
            <View style={styles.timeBlock}>
              <Ionicons name="log-out-outline" size={16} color={colors.primary} />
              <Text style={styles.timeLabel}>Salida</Text>
              <Text style={styles.timeValue}>{hermandad.exitTime}</Text>
            </View>
            <View style={styles.timeBlock}>
              <Ionicons name="log-in-outline" size={16} color={colors.primary} />
              <Text style={styles.timeLabel}>Entrada</Text>
              <Text style={styles.timeValue}>{hermandad.entryTime}</Text>
            </View>
            {duration && (
              <View style={styles.timeBlock}>
                <Ionicons name="hourglass-outline" size={16} color={colors.primary} />
                <Text style={styles.timeLabel}>Duración</Text>
                <Text style={styles.timeValue}>{duration}</Text>
              </View>
            )}
          </View>
          {(hermandad.times?.carreraOficial || hermandad.times?.entradaSantaCruz) && (
            <View style={[styles.rowBetween, { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#e0d8f0' }]}>
              {hermandad.times.carreraOficial && (
                <View style={styles.timeBlock}>
                  <Ionicons name="trail-sign-outline" size={16} color={colors.secondary} />
                  <Text style={styles.timeLabel}>Carrera Oficial</Text>
                  <Text style={styles.timeValue}>{hermandad.times.carreraOficial}</Text>
                </View>
              )}
              {hermandad.times.entradaSantaCruz && (
                <View style={styles.timeBlock}>
                  <Ionicons name="business-outline" size={16} color={colors.secondary} />
                  <Text style={styles.timeLabel}>Sta. Cruz</Text>
                  <Text style={styles.timeValue}>{hermandad.times.entradaSantaCruz}</Text>
                </View>
              )}
            </View>
          )}
        </SectionCard>

        {/* Información */}
        {(hermandad.tituloCompleto || hermandad.anoFundacion || hermandad.iglesia || hermandad.fecha || hermandad.webOficial) && (
          <SectionCard title="Información" icon="information-circle-outline">
            {hermandad.tituloCompleto && (
              <Text style={[styles.paragraph, { fontWeight: '600', marginBottom: 12 }]}>{hermandad.tituloCompleto}</Text>
            )}

            {/* Cajitas de información */}
            {(hermandad.anoFundacion || hermandad.iglesia || hermandad.fecha) && (
              <View style={styles.infoBoxes}>
                {hermandad.anoFundacion && (
                  <View style={[styles.infoBox, { backgroundColor: '#fff8f0' }]}>
                    <Text style={styles.infoBoxLabel}>Año de fundación</Text>
                    <Text style={styles.infoBoxValue}>{hermandad.anoFundacion}</Text>
                  </View>
                )}
                {hermandad.iglesia && (
                  <View style={[styles.infoBox, { backgroundColor: '#f8f4ff' }]}>
                    <Text style={styles.infoBoxLabel}>Sede canónica</Text>
                    <Text style={styles.infoBoxValue}>{hermandad.iglesia}</Text>
                  </View>
                )}
                {hermandad.fecha && (
                  <View style={[styles.infoBox, { backgroundColor: '#f0fff8' }]}>
                    <Text style={styles.infoBoxLabel}>Fecha procesión</Text>
                    <Text style={styles.infoBoxValue}>{hermandad.fecha}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Link web oficial */}
            {hermandad.webOficial && hermandad.webOficial !== 'Información no encontrada' && (
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 }}
                onPress={async () => {
                  try {
                    const url = hermandad.webOficial?.startsWith('http')
                      ? hermandad.webOficial
                      : `https://${hermandad.webOficial}`
                    const supported = await Linking.canOpenURL(url)
                    if (supported) {
                      await Linking.openURL(url)
                    } else {
                      Alert.alert('Error', 'No se puede abrir el enlace')
                    }
                  } catch (error) {
                    Alert.alert('Error', 'No se pudo abrir la web oficial')
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="globe-outline" size={16} color={colors.primary} />
                <Text style={[styles.paragraph, { fontSize: 14, color: colors.primary, textDecorationLine: 'underline' }]}>
                  Visitar web oficial
                </Text>
              </TouchableOpacity>
            )}
          </SectionCard>
        )}

        {/* Pasos */}
        {(hermandad.numeroPasos || hermandad.pasosImages || hermandad.pasos) && (
          <SectionCard title={`Pasos (${hermandad.pasos?.length || hermandad.numeroPasos || 0})`} icon="albums-outline">
            {hermandad.pasos && hermandad.pasos.length > 0 ? (
              hermandad.pasos.map((paso, idx) => (
                <View key={idx} style={styles.pasoCard}>
                  {/* Badge flotante en esquina */}
                  <View style={styles.pasoBadgeCorner}>
                    <LinearGradient
                      colors={['#6a1b9a', '#8e24aa']}
                      style={styles.pasoBadgeGradient}
                    >
                      <Text style={styles.pasoBadgeNumber}>{idx + 1}</Text>
                    </LinearGradient>
                  </View>

                  {/* Título del paso */}
                  <Text style={styles.pasoTitulo}>{paso.nombre}</Text>

                  {/* Descripción con fondo sutil */}
                  {(paso.descripcion || paso.descripcion_imagen) && (
                    <View style={styles.pasoDescripcionContainer}>
                      <Text style={styles.pasoDescripcionText}>
                        {paso.descripcion || paso.descripcion_imagen}
                      </Text>
                    </View>
                  )}

                  {/* Metadatos en chips */}
                  {(paso.tunica_nazarenos || paso.costaleros !== undefined) && (
                    <View style={styles.pasoMetadatos}>
                      {paso.tunica_nazarenos && (
                        <View style={styles.metaChip}>
                          <Ionicons name="shirt-outline" size={14} color="#6a1b9a" />
                          <View style={styles.metaChipContent}>
                            <Text style={styles.metaChipLabel}>Hábito</Text>
                            <Text style={styles.metaChipValue}>{paso.tunica_nazarenos}</Text>
                          </View>
                        </View>
                      )}
                      {paso.costaleros !== undefined && (
                        <View style={styles.metaChip}>
                          <Ionicons name="people-outline" size={14} color="#6a1b9a" />
                          <View style={styles.metaChipContent}>
                            <Text style={styles.metaChipLabel}>Costaleros</Text>
                            <Text style={styles.metaChipValue}>{paso.costaleros}</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <>
                {hermandad.numeroPasos && (
                  <Text style={[styles.paragraph, { marginBottom: 8 }]}>Número de pasos: {hermandad.numeroPasos}</Text>
                )}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pasosScroller} contentContainerStyle={styles.pasosScrollerContent}>
                  {(hermandad.pasosImages || []).map((p: string, idx: number) => (
                    <View key={idx} style={styles.pasoThumbWrapper}>
                      <View style={styles.pasoThumbPlaceholder}>
                        <Ionicons name="image-outline" size={28} color={colors.secondary} />
                        <Text style={styles.pasoThumbText}>Paso {idx + 1}</Text>
                      </View>
                    </View>
                  ))}
                  {(!hermandad.pasosImages || hermandad.pasosImages.length === 0) && (
                    <View style={styles.pasoThumbWrapper}>
                      <View style={styles.pasoThumbPlaceholder}>
                        <Ionicons name="alert-circle-outline" size={28} color={colors.muted} />
                        <Text style={styles.pasoThumbText}>Sin imágenes</Text>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </>
            )}
          </SectionCard>
        )}

        {/* Colores */}
        {hermandad.colors && (
          <SectionCard title="Hábito" icon="color-palette-outline">
            <Text style={styles.paragraph}>{hermandad.colors}</Text>
            {!!colorBadges.length && (
              <View style={styles.badgesRow}>
                {colorBadges.map(c => (
                  <View key={c} style={[styles.colorBadge, { backgroundColor: c }]} />
                ))}
              </View>
            )}
          </SectionCard>
        )}

        {/* Música */}
        {hermandad.music && (
          <SectionCard title="Música" icon="musical-notes-outline">
            <Text style={styles.paragraph}>{hermandad.music}</Text>
          </SectionCard>
        )}

        {/* Itinerario */}
        <SectionCard title="Itinerario" icon="walk-outline">
          {(() => {
            const [showAll, setShowAll] = useState(false)
            const MAX_ITEMS = 5
            const visibleItems = showAll ? hermandad.itinerary : hermandad.itinerary.slice(0, MAX_ITEMS)
            const remaining = hermandad.itinerary.length - MAX_ITEMS

            return (
              <View>
                {visibleItems.map((s: string, i: number) => (
                  <View key={i} style={styles.stepRow}>
                    <View style={styles.stepCircle}><Text style={styles.stepCircleText}>{i + 1}</Text></View>
                    <Text style={styles.stepText}>{s}</Text>
                  </View>
                ))}

                {hermandad.itinerary.length > MAX_ITEMS && (
                  <TouchableOpacity
                    onPress={() => setShowAll(!showAll)}
                    style={styles.expandButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.expandButtonText}>
                      {showAll ? 'Ver menos' : `Ver más (${remaining} más)`}
                    </Text>
                    <Ionicons name={showAll ? "chevron-up" : "chevron-down"} size={16} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            )
          })()}
        </SectionCard>

        {/* Acción Favorito secundaria */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={hermandad.isFavorite ? 'Quitar de favoritas' : 'Añadir a favoritas'}
          style={[styles.favoriteAction, hermandad.isFavorite && styles.favoriteActionActive]}
          onPress={() => toggleFavorite(hermandad.id)}
        >
          <Ionicons name={hermandad.isFavorite ? 'star' : 'star-outline'} size={18} color={hermandad.isFavorite ? colors.textLight : colors.secondary} />
          <Text style={[styles.favoriteActionText, hermandad.isFavorite && styles.favoriteActionTextActive]}>{hermandad.isFavorite ? 'En Favoritas' : 'Añadir a Favoritas'}</Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>Datos orientativos. Verifica horarios oficiales.</Text>
      </ScrollView>

      {/* Galería Personal */}
      <UserGalleryModal
        visible={galleryVisible}
        onClose={() => setGalleryVisible(false)}
        hermandadId={hermandad.id}
        hermandadName={hermandad.name}
      />
    </SafeAreaView>
  )
}

interface SectionCardProps { title: string; icon: any; children: React.ReactNode }
function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={18} color={colors.secondary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  statusMsg: { padding: 16 },
  scrollContent: { paddingBottom: 48 },
  heroWrapper: { width: '100%', backgroundColor: colors.surface },
  heroContainer: { width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#000' },
  heroImg: { width: '100%', height: undefined, aspectRatio: 16 / 9, resizeMode: 'contain' },
  // Placeholder keeps a fixed height if needed or matches aspect ratio
  heroPlaceholder: { aspectRatio: 16 / 9, backgroundColor: '#2a0a40', justifyContent: 'space-between' },
  heroGradient: { ...StyleSheet.absoluteFillObject, zIndex: 1 },

  heroTopBar: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.select({ ios: 44, android: 44, default: 16 }), zIndex: 10 },
  heroTopRight: { flexDirection: 'row', gap: 10 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  galleryPillBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.35)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22 },
  galleryPillText: { fontSize: 13, fontWeight: '600', color: colors.textLight, letterSpacing: 0.3 },

  heroBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingLeft: 90, paddingRight: 20, paddingBottom: 20, zIndex: 10 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: colors.textLight, marginBottom: 8, textShadowColor: 'rgba(0,0,0,0.75)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 },
  dayChip: { alignSelf: 'flex-start', backgroundColor: colors.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, elevation: 2 },
  dayChipText: { color: '#ffffff', fontSize: 13, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },

  heroCenterPlaceholder: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', zIndex: 5 },
  placeholderText: { marginTop: 8, color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '500' },

  nazarenoContainer: { position: 'absolute', left: 16, bottom: -30, width: 64, height: 64, borderRadius: 32, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, borderWidth: 2, borderColor: colors.surface, zIndex: 20 },
  shieldContainer: { position: 'absolute', right: 24, bottom: -30, width: 90, height: 90, borderRadius: 45, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, borderWidth: 3, borderColor: colors.surface, zIndex: 20 },
  shield: { width: 70, height: 70 },
  shieldPlaceholder: { width: '100%', height: '100%', backgroundColor: '#4b0082', borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  shieldLetter: { color: colors.secondary, fontSize: 36, fontWeight: '700' },
  card: { marginTop: 56, marginHorizontal: 16, backgroundColor: colors.surface, borderRadius: 14, padding: 14, elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.primary },
  cardBody: {},
  paragraph: { fontSize: 14, lineHeight: 20, color: colors.textDark },
  link: { marginTop: 8, fontSize: 13, fontWeight: '600', color: colors.primary },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  timeBlock: { flex: 1, alignItems: 'center', paddingVertical: 4 },
  timeLabel: { fontSize: 11, color: colors.muted, marginTop: 4 },
  timeValue: { fontSize: 15, fontWeight: '600', color: colors.primary, marginTop: 2 },
  badgesRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  colorBadge: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  stepCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  stepCircleText: { color: colors.textLight, fontSize: 12, fontWeight: '700' },
  stepText: { flex: 1, fontSize: 14, color: colors.textDark, lineHeight: 18 },
  expandButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginTop: 4, gap: 6 },
  expandButtonText: { fontSize: 14, fontWeight: '600', color: colors.primary },

  favoriteAction: { marginTop: 24, marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(212,175,55,0.12)', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(212,175,55,0.4)' },
  favoriteActionActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  favoriteActionText: { fontSize: 14, fontWeight: '600', color: colors.secondary },
  favoriteActionTextActive: { color: colors.textLight },
  disclaimer: { textAlign: 'center', fontSize: 11, color: colors.muted, marginTop: 24, marginBottom: 40 },
  // Pasos
  pasosScroller: { marginHorizontal: -14 },
  pasosScrollerContent: { paddingHorizontal: 2 },
  pasoThumbWrapper: { width: 120, height: 120, marginRight: 12 },
  pasoThumbPlaceholder: { flex: 1, backgroundColor: '#f2f2f6', borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e2e8' },
  pasoThumbText: { marginTop: 6, fontSize: 12, fontWeight: '600', color: colors.primary },
  // Información adicional
  infoRow: { marginBottom: 10 },
  infoLabel: { fontSize: 12, fontWeight: '600', color: colors.muted, marginBottom: 4 },
  infoValue: { fontSize: 14, color: colors.textDark, lineHeight: 20 },
  infoBoxes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  infoBox: { flex: 1, minWidth: 140, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e5e5e5' },
  infoBoxLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5 },
  infoBoxValue: { fontSize: 14, fontWeight: '600', color: colors.textDark, lineHeight: 18, flexWrap: 'wrap' },
  // Pasos detallados - Diseño profesional
  pasoCard: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#6a1b9a',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    borderWidth: 1,
    borderColor: '#f0e6f8',
  },
  pasoBadgeCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  pasoBadgeGradient: {
    width: 50,
    height: 50,
    borderBottomLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    paddingRight: 8,
  },
  pasoBadgeNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pasoTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c1a40',
    lineHeight: 24,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingRight: 60,
    marginBottom: 12,
  },
  pasoDescripcionContainer: {
    backgroundColor: '#faf7ff',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#d4af37',
  },
  pasoDescripcionText: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 21,
    letterSpacing: 0.2,
  },
  pasoMetadatos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  metaChip: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f4ff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e8dbf5',
  },
  metaChipContent: {
    flex: 1,
  },
  metaChipLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#8e24aa',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  metaChipValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c1a40',
    lineHeight: 18,
  },
})
