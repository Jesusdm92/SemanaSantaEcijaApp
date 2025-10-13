import React from 'react'
import { ScrollView, Text, StyleSheet, SafeAreaView, View, Linking, TouchableOpacity, Platform } from 'react-native'
import { colors } from '@mobile/theme/colors'
import { Ionicons } from '@expo/vector-icons'

interface LinkItem { label: string; url: string; icon: string }

const enlacesA: LinkItem[] = [
  { label: 'Ayuntamiento de Écija', url: 'https://www.ecija.es/', icon: 'business-outline' },
  { label: 'Turismo de Écija', url: 'https://turismoecija.com/', icon: 'map-outline' },
  { label: 'AEMET — Predicción Écija', url: 'https://www.aemet.es/es/eltiempo/prediccion/municipios/ecija-id41038', icon: 'cloud-outline' },
]
const enlacesB: LinkItem[] = [
  { label: 'Mapa OSM de Écija', url: 'https://www.openstreetmap.org/#map=15/37.542/-5.079', icon: 'navigate-outline' },
  { label: 'Listado de Hermandades', url: '#/hermandades', icon: 'albums-outline' },
  { label: 'Tus Favoritas', url: '#/favoritos', icon: 'star-outline' },
]

function openLink(url: string) {
  if (url.startsWith('http')) Linking.openURL(url)
  // si es hash interno (web) podría manejarse distinto; en native simplemente ignoramos
}

export default function About() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.screenTitle}>Semana Santa de Écija</Text>
        <Text style={styles.lead}>Guía práctica, cultural y devocional para visitantes y cofrades.</Text>

        <SectionCard icon="book-outline" title="Introducción">
          <Text style={styles.paragraph}>
            La Semana Santa de Écija combina patrimonio barroco, tradición y un profundo clima de recogimiento. Sus
            cortejos destacan por la elegancia, el silencio respetuoso en ciertos tramos y el colorido de hábitos y cirios.
            La Carrera Oficial se sitúa en torno a la Plaza de España — "El Salón", corazón neurálgico donde confluyen
            miles de miradas cada jornada.
          </Text>
          <Text style={styles.paragraph}>
            Esta aplicación te ayuda a planificar horarios, seguir itinerarios aproximados y marcar hermandades favoritas para
            tenerlas siempre a mano durante la semana.
          </Text>
        </SectionCard>

        <SectionCard icon="location-outline" title="Puntos de interés">
          {[
            'Plaza de España "El Salón": Carrera Oficial y ambiente central.',
            'Parroquia de Santiago: historia y salida de cortejos significativos.',
            'Parroquia de Santa Cruz: recogimiento y sobriedad.',
            'Parroquia de San Gil: tradición antigua y devoción popular.',
            'Iglesia de la Victoria: referencias destacadas del Viernes Santo.'
          ].map((t, i) => (
            <Bullet key={i} text={t} icon="ellipse-outline" />
          ))}
        </SectionCard>

        <SectionCard icon="bulb-outline" title="Consejos para disfrutar">
          <Bullet text="Llega con antelación a los puntos más concurridos." icon="time-outline" />
            <Bullet text="Respeta los cortejos y sigue indicaciones de organización." icon="people-outline" />
          <Bullet text="Hidrátate y usa calzado cómodo (recorridos largos)." icon="walk-outline" />
          <Bullet text="Establece un punto de encuentro si vas en grupo." icon="alert-circle-outline" />
          <Bullet text="Comprueba la meteorología antes de salir." icon="cloudy-outline" />
        </SectionCard>

        <SectionCard icon="airplane-outline" title="Logística para el visitante">
          <Text style={styles.paragraph}>
            Aparcamiento periférico recomendado en días de máxima afluencia. El centro histórico sufre cortes y desvíos
            escalonados; planifica accesos alternativos. Los establecimientos se llenan a mediodía y primeras horas de la noche:
            reserva o acude temprano.
          </Text>
          <Text style={styles.paragraph}>
            Para fotografía: evita flashes directos a imágenes y respeta la línea de paso. Mantén silencio en tramos de recogimiento.
            Lleva batería externa: la consulta de itinerarios y mapas consume energía.
          </Text>
        </SectionCard>

        <SectionCard icon="apps-outline" title="Sobre la aplicación">
          <Bullet text="Favoritos persistentes en el dispositivo." icon="star-outline" />
          <Bullet text="Itinerario con visualización aproximada en mapa." icon="map-outline" />
          <Bullet text="Diseño adaptado y limpio para consulta rápida." icon="phone-portrait-outline" />
          <Bullet text="Datos base offline; comprueba siempre fuentes oficiales." icon="warning-outline" />
        </SectionCard>

        <SectionCard icon="link-outline" title="Enlaces de interés">
          <View style={styles.linksRow}>
            <View style={styles.linksCol}>
              {enlacesA.map(l => <LinkRow key={l.url} item={l} />)}
            </View>
            <View style={styles.linksCol}>
              {enlacesB.map(l => <LinkRow key={l.url} item={l} />)}
            </View>
          </View>
        </SectionCard>

        <Text style={styles.disclaimer}>Información orientativa. Confirma horarios y modificaciones de última hora por canales oficiales.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

interface SectionCardProps { title: string; icon: string; children: React.ReactNode }
function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon as any} size={18} color={colors.secondary} />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  )
}

const Bullet: React.FC<{ text: string; icon?: string }> = ({ text, icon = 'ellipse-outline' }) => (
  <View style={styles.bulletRow}>
    <Ionicons name={icon as any} size={14} color={colors.primary} style={{ marginTop: 2, marginRight: 6 }} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
)

const LinkRow: React.FC<{ item: LinkItem }> = ({ item }) => (
  <TouchableOpacity accessibilityRole="link" onPress={() => openLink(item.url)} style={styles.linkRow}>
    <Ionicons name={item.icon as any} size={16} color={colors.primary} style={{ marginRight: 8 }} />
    <Text style={styles.linkText}>{item.label}</Text>
    {item.url.startsWith('http') && <Ionicons name="open-outline" size={14} color={colors.muted} style={{ marginLeft: 6 }} />}
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 48, paddingHorizontal: 16, paddingTop: 8 },
  screenTitle: { fontSize: 24, fontWeight: '700', color: colors.primary, marginTop: 4 },
  lead: { fontSize: 14, color: colors.textDark, marginTop: 4, marginBottom: 16, lineHeight: 20 },
  paragraph: { fontSize: 14, lineHeight: 20, color: colors.textDark, marginBottom: 12 },
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 14, marginBottom: 18, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.primary },
  cardBody: {},
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.textDark },
  linksRow: { flexDirection: 'row', gap: 16 },
  linksCol: { flex: 1 },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  linkText: { fontSize: 14, color: colors.primary, textDecorationLine: Platform.select({ web: 'underline', default: 'none' }) },
  disclaimer: { fontSize: 11, textAlign: 'center', color: colors.muted, marginTop: 8, marginBottom: 32 }
})
