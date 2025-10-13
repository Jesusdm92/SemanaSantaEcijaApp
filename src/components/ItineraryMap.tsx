import { useEffect } from 'react'
import L from 'leaflet'

export default function ItineraryMap({ itinerary, name }: { itinerary: string[]; name: string }) {
  useEffect(() => {
    const ecijaCenter: [number, number] = [37.542, -5.079]
    const map = L.map('itineraryMap').setView(ecijaCenter, 15)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    const geocodeStreet = (index: number): [number, number] => {
      const offsetLat = (Math.random() - 0.5) * 0.005
      const offsetLng = (Math.random() - 0.5) * 0.005
      return [ecijaCenter[0] + offsetLat, ecijaCenter[1] + offsetLng]
    }

    const points = itinerary.map((_, idx) => geocodeStreet(idx))

    if (points.length > 0) {
      const startPoint = points[0]
      const endPoint = points[points.length - 1]

      const styles = getComputedStyle(document.documentElement)
      const primary = styles.getPropertyValue('--primary-color').trim() || '#4b0082'
      const secondary = styles.getPropertyValue('--secondary-color').trim() || '#d4af37'

      // Marcadores de inicio (oro) y fin (morado) como círculos con borde blanco
      L.circleMarker(startPoint, {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: secondary,
        fillOpacity: 0.95,
      }).addTo(map).bindPopup(`<b>Salida:</b> ${itinerary[0]}`).openPopup()

      L.circleMarker(endPoint, {
        radius: 8,
        color: '#ffffff',
        weight: 2,
        fillColor: primary,
        fillOpacity: 0.95,
      }).addTo(map).bindPopup(`<b>Entrada:</b> ${itinerary[itinerary.length - 1]}`)

      const polyline = L.polyline(points, { color: primary, weight: 4, opacity: 0.9 }).addTo(map)
      map.fitBounds(polyline.getBounds().pad(0.1))

      // Leyenda sencilla
  const legend = new L.Control({ position: 'bottomleft' })
  ;(legend as any).onAdd = () => {
        const div = L.DomUtil.create('div', 'map-legend')
        div.innerHTML = `
          <div><span class="legend-dot start"></span> Salida</div>
          <div><span class="legend-dot end"></span> Entrada</div>
        `
        return div
      }
      legend.addTo(map)
    }

  return () => { map.remove() }
  }, [itinerary, name])

  return <div id="itineraryMap"></div>
}
