import { useMemo } from 'react'
import { useHermandades } from '@/context/HermandadesContext'
import { Link } from 'react-router-dom'

const DAYS_ORDER = [
  'Domingo de Ramos', 'Lunes Santo', 'Martes Santo', 'Miércoles Santo',
  'Jueves Santo', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
]

function mapWeekdayToSS(dayIndex: number): string | null {
  // 0=Domingo, 1=Lunes, ... 6=Sábado
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

export default function HoySale() {
  const { hermandades, loading } = useHermandades()
  const todayLabel = mapWeekdayToSS(new Date().getDay())

  const hoy = useMemo(() => {
    if (!todayLabel) return []
    return hermandades.filter(h => h.day === todayLabel)
  }, [hermandades, todayLabel])

  console.log('HoySale — hermandades:', hermandades.length, 'todayLabel:', todayLabel, 'hoy:', hoy.length)

  if (loading) {
    return (
      <div className="container py-4">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border" style={{ color: '#6a1b9a' }} role="status">
            <span className="visually-hidden">Cargando…</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      {/* Header con gradiente morado */}
      <div className="mb-4 p-4 rounded-3 shadow-sm" style={{ 
        background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
        color: '#1a1a1a'
      }}>
        <h1 className="h2 fw-bold mb-2">
          <i className="bi bi-sun me-2"></i>
          Hoy sale…
        </h1>
        <p className="mb-0 opacity-90" style={{ fontSize: '0.95rem' }}>
          {todayLabel ? (
            <>Procesiones programadas para <strong>{todayLabel}</strong></>
          ) : (
            <>Hoy no es un día de Semana Santa</>
          )}
        </p>
      </div>

      {hoy.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="mb-4" style={{ 
              width: '100px', 
              height: '100px', 
              margin: '0 auto',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#d4af37' }}></i>
            </div>
            <h5 className="fw-bold mb-2" style={{ color: '#6a1b9a' }}>
              {todayLabel 
                ? 'No hay procesiones hoy'
                : 'Fuera de Semana Santa'}
            </h5>
            <p className="text-muted mb-0" style={{ maxWidth: '400px', margin: '0 auto' }}>
              {todayLabel 
                ? `Hoy (${todayLabel}) no está prevista ninguna procesión.`
                : 'Las procesiones de Semana Santa se celebran en fechas específicas. Consulta la Agenda Cofrade para ver el calendario completo.'}
            </p>
            <Link 
              to="/agenda" 
              className="btn mt-4"
              style={{
                background: 'linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '0.6rem 1.5rem',
                fontWeight: '600'
              }}
            >
              <i className="bi bi-calendar-week me-2"></i>
              Ver Agenda Completa
            </Link>
          </div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm" style={{ overflow: 'hidden' }}>
          <div className="card-header py-3" style={{ 
            background: 'linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%)',
            borderBottom: '3px solid #d4af37'
          }}>
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="mb-0 fw-bold" style={{ color: '#6a1b9a' }}>
                <i className="bi bi-calendar-check me-2"></i>
                {todayLabel}
              </h5>
              <span className="badge" style={{ 
                background: 'linear-gradient(135deg, #d4af37 0%, #f4d03f 100%)',
                color: '#1a1a1a',
                fontSize: '0.85rem',
                padding: '0.5rem 0.9rem',
                borderRadius: '20px',
                fontWeight: '700'
              }}>
                {hoy.length} {hoy.length === 1 ? 'hermandad' : 'hermandades'}
              </span>
            </div>
          </div>

          <div className="card-body p-0">
            <div className="list-group list-group-flush">
              {hoy.map(h => (
                <div 
                  key={h.id} 
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 px-4"
                  style={{ 
                    transition: 'all 0.2s ease',
                    borderLeft: '4px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderLeftColor = '#d4af37'
                    e.currentTarget.style.backgroundColor = '#fffbf0'
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
          </div>
        </div>
      )}
    </div>
  )
}
