import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useHermandades } from '../context/HermandadesContext'
import { colors } from '../theme/colors'
import { Hermandad } from '../types/hermandad'
import { useTypedNavigation } from '../hooks/useTypedNavigation'

const DAYS_ORDER = [
  'Domingo de Ramos', 'Lunes Santo', 'Martes Santo', 'Miércoles Santo',
  'Jueves Santo', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
]

export default function PorDias() {
  const { hermandades, loading } = useHermandades()
  const [active, setActive] = useState<string | null>(null)
  const [onlyFavs, setOnlyFavs] = useState(false)
  const navigation = useTypedNavigation()

  const groups = useMemo(() => {
    const map = new Map<string, Hermandad[]>()
    hermandades.forEach(h => {
      const key = h.day || 'Sin día'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(h)
    })
    const arr = Array.from(map.entries()).map(([day, items]) => ({ day, items }))
    arr.sort((a, b) => {
      const ai = DAYS_ORDER.indexOf(a.day)
      const bi = DAYS_ORDER.indexOf(b.day)
      if (ai === -1 && bi === -1) return a.day.localeCompare(b.day, 'es') as any
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
    return arr
  }, [hermandades])

  useEffect(() => {
    if (!active && groups.length > 0) {
      const map = [
        'Domingo de Ramos','Lunes Santo','Martes Santo','Miércoles Santo','Jueves Santo','Viernes Santo','Sábado Santo'
      ]
      const todayLabel = map[new Date().getDay()] || null
      const exists = groups.some(g => g.day === todayLabel)
      if (todayLabel && exists) setActive(todayLabel)
    }
  }, [groups, active])

  if (loading) return <View style={styles.container}><Text>Cargando…</Text></View>

  const visibleDay = active ?? groups[0]?.day ?? null

  return (
    <View style={{ flex: 1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs} contentContainerStyle={{ paddingHorizontal: 12 }}>
        {groups.map(g => (
          <TouchableOpacity key={g.day} style={[styles.tab, visibleDay === g.day && styles.tabActive]} onPress={() => setActive(g.day)}>
            <Text style={[styles.tabText, visibleDay === g.day && styles.tabTextActive]}>{g.day}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtros */}
      <View style={{ paddingHorizontal: 12, paddingTop: 8, alignItems: 'flex-end' }}>
        <TouchableOpacity onPress={() => setOnlyFavs(v => !v)} style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 14, backgroundColor: onlyFavs ? colors.primary : '#f2f2f2' }}>
          <Text style={{ color: onlyFavs ? '#fff' : '#333', fontWeight: '600' }}>Sólo favoritas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 12 }}>
        {groups.map(g => (
          <View key={g.day} style={{ display: visibleDay === g.day ? 'flex' : 'none' }}>
            {g.items.filter(h => !onlyFavs || h.isFavorite).map(h => (
              <TouchableOpacity key={h.id} style={styles.item} onPress={() => navigation.navigate('Detail', { id: h.id })}>
                <Text style={styles.itemTitle}>{h.name}</Text>
                <Text style={styles.itemTimes}>Salida {h.exitTime}h · Entrada {h.entryTime}h</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabs: { backgroundColor: '#fff', paddingVertical: 8, borderBottomColor: '#eee', borderBottomWidth: 1 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, backgroundColor: '#f2f2f2', marginRight: 8 },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: '#333', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  item: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 10, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  itemTitle: { fontSize: 16, fontWeight: '700', color: colors.primary },
  itemTimes: { marginTop: 4, color: '#555' }
})
