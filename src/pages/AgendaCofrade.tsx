import { useEffect, useMemo, useState } from 'react'
import { useHermandades } from '@/context/HermandadesContext'
import { Link } from 'react-router-dom'
import SeoHead from '@/components/SeoHead'

const DAYS_ORDER = [
  'Domingo de Ramos', 'Lunes Santo', 'Martes Santo', 'Miércoles Santo',
  'Jueves Santo', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
]

export default function AgendaCofrade() {
  const { hermandades, loading } = useHermandades()
  const [active, setActive] = useState<string>(DAYS_ORDER[0])
  const [onlyFavs, setOnlyFavs] = useState(false)

  // Crear grupos para TODOS los días, tengan o no hermandades
  const allDays = useMemo(() => {
    const map = new Map<string, typeof hermandades>()

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
    // Establecer el primer día como activo al cargar
    if (!active) {
      setActive(DAYS_ORDER[0])
    }
  }, [])

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando…</span>
          </div>
        </div>
      </div>
    )
  }

  const visibleDayData = allDays.find(d => d.day === active)
  const filteredItems = visibleDayData?.items.filter(h => !onlyFavs || h.isFavorite) || []

  return (
    <>
      <SeoHead
        title="Agenda Cofrade · Calendario de Procesiones"
        description="Calendario completo de las procesiones de Semana Santa en Écija 2025. Consulta qué hermandades salen cada día y a qué hora."
        url="/agenda"
      />
      <div className="container py-4">
        {/* Header mejorado con caja de color */}
        <div className="mb-4 p-4 rounded-3 shadow-sm" style={{
          background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
          color: 'white'
        }}>
          <h1 className="h2 fw-bold mb-2">
            <i className="bi bi-calendar-week me-2"></i>
            Agenda Cofrade
          </h1>
          <p className="mb-0 opacity-90" style={{ fontSize: '0.95rem' }}>
            Consulta el calendario completo de procesiones de Semana Santa
          </p>
        </div>

        {/* Pills de días rediseñadas */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h6 className="text-uppercase fw-bold mb-0" style={{ color: '#6a1b9a', fontSize: '0.75rem', letterSpacing: '0.8px' }}>
              Selecciona un día
            </h6>
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="onlyFavsAgenda"
                checked={onlyFavs}
                onChange={(e) => setOnlyFavs(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <label className="form-check-label fw-semibold" htmlFor="onlyFavsAgenda" style={{ fontSize: '0.9rem', cursor: 'pointer', color: '#6a1b9a' }}>
                <i className="bi bi-star-fill me-1" style={{ color: '#d4af37' }}></i>
                Solo favoritas
              </label>
            </div>
          </div>

          <div className="d-flex gap-2 overflow-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {allDays.map(d => (
              <button
                key={d.day}
                onClick={() => setActive(d.day)}
                className="btn"
                style={{
                  whiteSpace: 'nowrap',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  borderRadius: '25px',
                  padding: '0.6rem 1.2rem',
                  border: active === d.day ? 'none' : '2px solid #e0e0e0',
                  background: active === d.day ? 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)' : 'white',
                  color: active === d.day ? 'white' : '#6a1b9a',
                  transition: 'all 0.3s ease',
                  boxShadow: active === d.day ? '0 4px 12px rgba(106, 27, 154, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (active !== d.day) {
                    e.currentTarget.style.borderColor = '#8e24aa'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== d.day) {
                    e.currentTarget.style.borderColor = '#e0e0e0'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }
                }}
              >
                {d.day}
                {d.count > 0 && (
                  <span
                    className="badge ms-2"
                    style={{
                      fontSize: '0.7rem',
                      borderRadius: '12px',
                      background: active === d.day ? 'rgba(255, 255, 255, 0.25)' : '#d4af37',
                      color: active === d.day ? 'white' : '#1a1a1a',
                      fontWeight: '700',
                      padding: '0.25rem 0.5rem'
                    }}
                  >
                    {d.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido del día seleccionado */}
        <div className="card border-0 shadow-sm" style={{ overflow: 'hidden' }}>
          <div className="card-header py-3" style={{
            background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)',
            borderBottom: '3px solid #6a1b9a'
          }}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0 fw-bold" style={{ color: '#6a1b9a' }}>
                <i className="bi bi-calendar-event me-2"></i>
                {active}
              </h5>
              <span className="badge" style={{
                background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
                color: 'white',
                fontSize: '0.85rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '20px'
              }}>
                {filteredItems.length} {filteredItems.length === 1 ? 'hermandad' : 'hermandades'}
              </span>
            </div>
          </div>

          <div className="card-body p-0">
            {filteredItems.length === 0 ? (
              <div className="text-center py-5 px-3">
                <div className="mb-3" style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="bi bi-calendar-x" style={{ fontSize: '2.5rem', color: '#9e9e9e' }}></i>
                </div>
                <p className="fw-semibold mb-1" style={{ color: '#6a1b9a' }}>
                  {onlyFavs
                    ? 'No hay hermandades favoritas para este día'
                    : 'No hay procesiones previstas'}
                </p>
                <p className="text-muted small mb-0">
                  {onlyFavs
                    ? 'Desmarca el filtro para ver todas las hermandades'
                    : 'Este día no tiene procesiones programadas'}
                </p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {filteredItems.map(h => (
                  <div
                    key={h.id}
                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 px-4"
                    style={{
                      transition: 'all 0.2s ease',
                      borderLeft: '4px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderLeftColor = '#8e24aa'
                      e.currentTarget.style.backgroundColor = '#f8f4ff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderLeftColor = 'transparent'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <h6 className="mb-0 fw-bold" style={{ color: '#1a1a1a' }}>
                          {h.name}
                        </h6>
                        {h.isFavorite && (
                          <i className="bi bi-star-fill" style={{ color: '#d4af37', fontSize: '0.95rem' }}></i>
                        )}
                      </div>
                      <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.85rem', color: '#666' }}>
                        <span className="d-flex align-items-center">
                          <i className="bi bi-box-arrow-right me-1" style={{ color: '#6a1b9a' }}></i>
                          Salida: <strong className="ms-1" style={{ color: '#1a1a1a' }}>{(h.exitTime && h.exitTime.trim() !== '' ? h.exitTime : '--:--')}h</strong>
                        </span>
                        {h.times?.carreraOficial && (
                          <span className="d-flex align-items-center">
                            <i className="bi bi-signpost-split me-1" style={{ color: '#d4af37' }}></i>
                            CO: <strong className="ms-1" style={{ color: '#1a1a1a' }}>{h.times.carreraOficial}h</strong>
                          </span>
                        )}
                        <span className="d-flex align-items-center">
                          <i className="bi bi-box-arrow-in-left me-1" style={{ color: '#6a1b9a' }}></i>
                          Entrada: <strong className="ms-1" style={{ color: '#1a1a1a' }}>{(h.entryTime && h.entryTime.trim() !== '' ? h.entryTime : '--:--')}h</strong>
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/hermandades/${h.id}`}
                      className="btn btn-sm"
                      style={{
                        borderRadius: '20px',
                        fontWeight: '600',
                        padding: '0.5rem 1.2rem',
                        background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
                        color: 'white',
                        border: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(106, 27, 154, 0.3)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <i className="bi bi-eye me-1"></i>
                      Ver detalles
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
