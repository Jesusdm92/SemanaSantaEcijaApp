import React, { useMemo } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Linking } from 'react-native'
import { useHermandades } from '../context/HermandadesContext'
import { colors } from '../theme/colors'
import { useTypedNavigation } from '../hooks/useTypedNavigation'
import { LinearGradient } from 'expo-linear-gradient'

function getEasterDate(year: number): Date {
  const f = Math.floor
  const G = year % 19
  const C = f(year / 100)
  const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11))
  const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7
  const L = I - J
  const Month = 3 + f((L + 40) / 44)
  const Day = L + 28 - 31 * f(Month / 4)
  return new Date(year, Month - 1, Day)
}

function getHolyWeekDay(date: Date): string | null {
  const year = date.getFullYear()
  const easter = getEasterDate(year)

  // Clonar fechas para evitar efectos secundarios
  const checkDate = new Date(date)
  checkDate.setHours(0, 0, 0, 0)

  const easterDate = new Date(easter)
  easterDate.setHours(0, 0, 0, 0)

  // Comparar con Domingo de Resurrección
  const diffTime = checkDate.getTime() - easterDate.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  switch (diffDays) {
    case -7: return 'Domingo de Ramos'
    case -6: return 'Lunes Santo'
    case -5: return 'Martes Santo'
    case -4: return 'Miércoles Santo'
    case -3: return 'Jueves Santo'
    case -2: return 'Viernes Santo'
    case -1: return 'Sábado Santo'
    case 0: return 'Domingo de Resurrección'
    default: return null
  }
}

export default function HoySale() {
  const { hermandades, loading } = useHermandades()
  const navigation = useTypedNavigation()
  const today = new Date()
  const todayLabel = getHolyWeekDay(today)

  // Cálculos para cuenta atrás / finalización
  const year = today.getFullYear()
  const easter = getEasterDate(year)

  const todayZero = new Date(today)
  todayZero.setHours(0, 0, 0, 0)
  const easterZero = new Date(easter)
  easterZero.setHours(0, 0, 0, 0)

  const diffTime = easterZero.getTime() - todayZero.getTime()
  const diffDaysToEaster = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  // Domingo de Ramos es 7 días antes del Domingo de Resurrección
  const daysToPalmSunday = diffDaysToEaster - 7

  const isPreSemana = daysToPalmSunday > 0
  const isPostSemana = diffDaysToEaster < 0

  const hoy = useMemo(() => {
    if (!todayLabel) return []
    return hermandades.filter(h => h.day === todayLabel)
  }, [hermandades, todayLabel])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando…</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header con gradiente dorado */}
      <LinearGradient
        colors={['#d4af37', '#f4d03f']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>☀️ Hoy sale…</Text>
        <Text style={styles.headerSubtitle}>
          {todayLabel ? (
            <>Procesiones para {todayLabel}</>
          ) : isPreSemana ? (
            <>Faltan {daysToPalmSunday} días para el Domingo de Ramos</>
          ) : isPostSemana ? (
            <>Semana Santa {year} finalizada</>
          ) : (
            <>Hoy no es un día de procesiones</>
          )}
        </Text>
      </LinearGradient>

      {hoy.length === 0 ? (
        <View style={styles.card}>
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={{ fontSize: 48 }}>
                {isPreSemana ? '⏳' : isPostSemana ? '🏁' : '📅'}
              </Text>
            </View>
            <Text style={styles.emptyTitle}>
              {todayLabel
                ? 'No hay procesiones hoy'
                : isPreSemana
                  ? 'Cuenta atrás'
                  : isPostSemana
                    ? 'Hasta el año que viene'
                    : 'Fuera de Semana Santa'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {todayLabel
                ? `Hoy (${todayLabel}) no está prevista ninguna procesión.`
                : isPreSemana
                  ? `Ya queda menos. La Semana Santa de Écija ${year} comenzará en ${daysToPalmSunday} días. ¡Prepárate!`
                  : isPostSemana
                    ? `La Semana Santa de Écija ${year} ha concluido. Esperamos que hayas disfrutado de una magnífica semana.`
                    : 'Las procesiones de Semana Santa se celebran en fechas específicas.'}
            </Text>
            <TouchableOpacity
              style={styles.agendaButton}
              onPress={() => navigation.navigate('Tabs', { screen: 'AgendaTab' })}
              activeOpacity={0.8}
            >
              <Text style={styles.agendaButtonText}>📅 Ver Agenda Completa</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>📆 {todayLabel}</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {hoy.length} {hoy.length === 1 ? 'hermandad' : 'hermandades'}
                </Text>
              </View>
            </View>

            <View style={styles.cardBody}>
              {hoy.map((h, index) => (
                <TouchableOpacity
                  key={h.id}
                  style={[styles.item, index === hoy.length - 1 && { borderBottomWidth: 0 }]}
                  onPress={() => navigation.navigate('Detail', { id: h.id })}
                  activeOpacity={0.7}
                >
                  <View style={styles.itemContent}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{h.name}</Text>
                      {h.isFavorite && <Text style={{ fontSize: 16 }}>⭐</Text>}
                    </View>
                    <View style={styles.itemTimes}>
                      <View style={styles.timeItem}>
                        <Text style={styles.timeLabel}>🚪 Salida:</Text>
                        <Text style={styles.timeValue}>{h.exitTime}h</Text>
                      </View>
                      {h.times?.carreraOficial && (
                        <View style={styles.timeItem}>
                          <Text style={styles.timeLabel}>🏛️ CO:</Text>
                          <Text style={styles.timeValue}>{h.times.carreraOficial}h</Text>
                        </View>
                      )}
                      <View style={styles.timeItem}>
                        <Text style={styles.timeLabel}>🏁 Entrada:</Text>
                        <Text style={styles.timeValue}>{h.entryTime}h</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.itemArrow}>
                    <Text style={styles.arrowText}>👁️ Ver</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(26,26,26,0.8)',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: 16,
    marginHorizontal: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 3,
    borderBottomColor: '#d4af37',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6a1b9a',
  },
  countBadge: {
    backgroundColor: '#d4af37',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  cardBody: {
    // No additional styling needed
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff3cd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6a1b9a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  agendaButton: {
    backgroundColor: '#6a1b9a',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  agendaButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    flexWrap: 'wrap',
  },
  itemTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  timeValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  itemArrow: {
    backgroundColor: '#6a1b9a',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 4,
    flexShrink: 0,
  },
  arrowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
})
