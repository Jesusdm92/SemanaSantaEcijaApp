import React, { useMemo } from 'react'
import { View, StyleSheet, Platform, Text } from 'react-native'
// Import diferido para evitar cargar react-native-maps en web
let MapView: any, Marker: any, Polyline: any
// Tipo mínimo para region si no está disponible la definición de react-native-maps
type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number }
if (Platform.OS !== 'web') {
  const RNMaps = require('react-native-maps')
  MapView = RNMaps.default
  Marker = RNMaps.Marker
  Polyline = RNMaps.Polyline
}
import { colors } from '@mobile/theme/colors'

interface Props {
  itinerary: string[]
}

// Genera coordenadas sintéticas alrededor de un centro (Écija) para demo
function generateRoute(itinerary: string[]) {
  const center = { lat: 37.542, lng: -5.079 }
  return itinerary.map((_, idx) => {
    const jitterLat = (Math.random() - 0.5) * 0.01
    const jitterLng = (Math.random() - 0.5) * 0.01
    return { latitude: center.lat + jitterLat + idx * 0.0003, longitude: center.lng + jitterLng }
  })
}

export const ItineraryMap: React.FC<Props> = ({ itinerary }) => {
  const points = useMemo(() => generateRoute(itinerary), [itinerary])
  const region: Region = {
    latitude: points[0]?.latitude || 37.542,
    longitude: points[0]?.longitude || -5.079,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03
  }
  const start = points[0]
  const end = points[points.length - 1]

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.wrapper, styles.webPlaceholder]}>
        <Text style={styles.placeholderText}>Mapa no disponible en la versión web móvil (demo)</Text>
      </View>
    )
  }
  return (
    <View style={styles.wrapper}>
      <MapView style={styles.map} initialRegion={region}>
        {points.length > 0 && (
          <>
            <Polyline coordinates={points} strokeColor={colors.primary} strokeWidth={4} />
            {start && (<Marker coordinate={start} title="Salida" pinColor={colors.secondary} />)}
            {end && (<Marker coordinate={end} title="Entrada" pinColor={colors.primary} />)}
          </>
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { height: 240, borderRadius: 16, overflow: 'hidden', marginTop: 16 },
  map: { flex: 1 },
  webPlaceholder: { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee', padding: 16 },
  placeholderText: { fontSize: 12, color: '#555', textAlign: 'center' }
})
