import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useHermandades } from '../context/HermandadesContext'
import { colors } from '../theme/colors'
import { Hermandad } from '../types/hermandad'
import { useTypedNavigation } from '../hooks/useTypedNavigation'
import { LinearGradient } from 'expo-linear-gradient'
import WeatherForecast from '../components/WeatherForecast'

const DAYS_ORDER = [
  'Domingo de Ramos', 'Lunes Santo', 'Martes Santo', 'Miércoles Santo',
  'Jueves Santo', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
]

export default function AgendaCofrade() {
  const { hermandades, loading } = useHermandades()
  const [active, setActive] = useState<string>(DAYS_ORDER[0])
  const [onlyFavs, setOnlyFavs] = useState(false)
  const navigation = useTypedNavigation()

  // Crear grupos para TODOS los días, tengan o no hermandades
  const allDays = useMemo(() => {
    const map = new Map<string, Hermandad[]>()

    // Inicializar TODOS los días con array vacío
    DAYS_ORDER.forEach(day => {
      map.set(day, [])
    })

    // Añadir hermandades a los días correspondientes
    hermandades.forEach(h => {
      const key = h.day || 'Sin día'
      if (map.has(key)) {
        map.get(key)!.push(h)
      }
    })

    // Convertir a array manteniendo el orden de DAYS_ORDER
    return DAYS_ORDER.map(day => ({
      day,
      items: map.get(day) || [],
      count: map.get(day)?.length || 0
    }))
  }, [hermandades])

  useEffect(() => {
    if (!active) {
      setActive(DAYS_ORDER[0])
    }
  }, [])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6a1b9a" />
        <Text style={{ marginTop: 10, color: '#666' }}>Cargando…</Text>
      </View>
    )
  }

  const visibleDayData = allDays.find(d => d.day === active)
  const filteredItems = visibleDayData?.items.filter(h => !onlyFavs || h.isFavorite) || []

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header con gradiente morado */}
      <LinearGradient
        colors={['#6a1b9a', '#8e24aa']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>📅 Agenda Cofrade</Text>
        <Text style={styles.headerSubtitle}>Calendario completo de procesiones</Text>
      </LinearGradient>

      {/* Previsión meteorológica 7 días */}
      <WeatherForecast />

      {/* Selector de días con scroll horizontal */}
      <View style={styles.selectorContainer}>
        <View style={styles.selectorHeader}>
          <Text style={styles.selectorLabel}>SELECCIONA UN DÍA</Text>
          <TouchableOpacity
            onPress={() => setOnlyFavs(v => !v)}
            style={[styles.filterButton, onlyFavs && styles.filterButtonActive]}
          >
            <Text style={[styles.filterText, onlyFavs && styles.filterTextActive]}>
              ⭐ Solo favoritas
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {allDays.map(d => (
            <TouchableOpacity
              key={d.day}
              style={[styles.tab, active === d.day && styles.tabActive]}
              onPress={() => setActive(d.day)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, active === d.day && styles.tabTextActive]}>
                {d.day}
              </Text>
              {d.count > 0 && (
                <View style={[styles.badge, active === d.day && styles.badgeActive]}>
                  <Text style={[styles.badgeText, active === d.day && styles.badgeTextActive]}>
                    {d.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Contenido del día seleccionado */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📆 {active}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {filteredItems.length} {filteredItems.length === 1 ? 'hermandad' : 'hermandades'}
              </Text>
            </View>
          </View>

          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Text style={{ fontSize: 48 }}>📅</Text>
              </View>
              <Text style={styles.emptyTitle}>
                {onlyFavs
                  ? 'No hay hermandades favoritas'
                  : 'No hay procesiones previstas'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {onlyFavs
                  ? 'Desmarca el filtro para ver todas'
                  : 'Este día no tiene procesiones programadas'}
              </Text>
            </View>
          ) : (
            filteredItems.map((h, index) => (
              <TouchableOpacity
                key={h.id}
                style={[styles.item, index === filteredItems.length - 1 && { borderBottomWidth: 0 }]}
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
            ))
          )}
        </View>
      </ScrollView>
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
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  selectorContainer: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6a1b9a',
    letterSpacing: 0.5,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterButtonActive: {
    backgroundColor: '#6a1b9a',
    borderColor: '#6a1b9a',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6a1b9a',
  },
  filterTextActive: {
    color: '#fff',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#6a1b9a',
    borderColor: '#6a1b9a',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6a1b9a',
  },
  tabTextActive: {
    color: '#fff',
  },
  badge: {
    backgroundColor: '#d4af37',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  badgeTextActive: {
    color: '#fff',
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 3,
    borderBottomColor: '#6a1b9a',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6a1b9a',
  },
  countBadge: {
    backgroundColor: '#6a1b9a',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6a1b9a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
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
