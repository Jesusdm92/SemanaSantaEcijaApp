import { useEffect, useMemo, useState } from 'react'
import { useHermandades } from '@/context/HermandadesContext'
import HermandadCard from '@/components/HermandadCard'

const DAYS_ORDER = [
  'Domingo de Ramos',
  'Lunes Santo',
  'Martes Santo',
  'Miércoles Santo',
  'Jueves Santo',
  'Viernes Santo',
  'Sábado Santo',
  'Domingo de Resurrección'
]

export default function PorDias() {
  const { hermandades, loading } = useHermandades()
  const [active, setActive] = useState<string | null>(null)
  const [onlyFavs, setOnlyFavs] = useState(false)

  const mapWeekdayToSS = (dayIndex: number): string | null => {
    const map = [
      'Domingo de Ramos',
      'Lunes Santo',
      'Martes Santo',
      'Miércoles Santo',
      'Jueves Santo',
      'Viernes Santo',
      'Sábado Santo'
    ]
    return map[dayIndex] ?? null
  }

  const groups = useMemo(() => {
    const map = new Map<string, typeof hermandades>()
    hermandades.forEach(h => {
      const key = h.day || 'Sin día'
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(h)
    })
    const arr = Array.from(map.entries()).map(([day, items]) => ({ day, items }))
    arr.sort((a, b) => {
      const ai = DAYS_ORDER.indexOf(a.day)
      const bi = DAYS_ORDER.indexOf(b.day)
      if (ai === -1 && bi === -1) return a.day.localeCompare(b.day, 'es')
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
    return arr
  }, [hermandades])

  if (loading) return <div className="container py-4">Cargando…</div>

  // Seleccionar el día de hoy si existe en los grupos
  useEffect(() => {
    if (!active && groups.length > 0) {
      const todayLabel = mapWeekdayToSS(new Date().getDay())
      const exists = groups.some(g => g.day === todayLabel)
      if (todayLabel && exists) setActive(todayLabel)
    }
  }, [groups, active])

  const visibleDay = active ?? groups[0]?.day ?? null

  return (
    <div className="container py-4">
      <h1 className="mb-3 h3">Hermandades por día</h1>

      {/* Selector de días */}
      <ul className="nav nav-pills mb-3 flex-wrap" role="tablist" aria-label="Selector de días">
        {groups.map(g => (
          <li className="nav-item me-2 mb-2" key={g.day}>
            <button
              className={`nav-link ${visibleDay === g.day ? 'active' : ''}`}
              onClick={() => setActive(g.day)}
              role="tab"
              aria-selected={visibleDay === g.day}
            >
              {g.day}
            </button>
          </li>
        ))}
      </ul>

      {/* Filtros */}
      <div className="d-flex justify-content-end mb-3">
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" id="onlyFavs"
            checked={onlyFavs} onChange={(e) => setOnlyFavs(e.target.checked)} />
          <label className="form-check-label" htmlFor="onlyFavs">Sólo favoritas</label>
        </div>
      </div>

      {/* Listado del día activo */}
      {groups.map(g => (
        <div key={g.day} hidden={visibleDay !== g.day} role="tabpanel" aria-labelledby={g.day}>
          <div className="row">
            {g.items.filter(h => !onlyFavs || h.isFavorite).map(h => (
              <HermandadCard key={h.id} hermandad={h} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
