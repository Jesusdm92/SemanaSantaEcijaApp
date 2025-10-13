import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useHermandades } from '@/context/HermandadesContext'
import ItineraryMap from '@/components/ItineraryMap'
import LoadingSpinner from '@/components/LoadingSpinner'
import type { Hermandad } from '@/types/hermandad'

export default function HermandadDetail() {
  const { id } = useParams()
  const { getHermandadById, toggleFavorite, loading } = useHermandades()
  const navigate = useNavigate()
  const [hermandad, setHermandad] = useState<Hermandad | null>(null)

  useEffect(() => {
    if (!loading) {
      const found = getHermandadById(id || '')
      if (found) setHermandad(found)
      else navigate('/hermandades')
    }
  }, [id, loading, getHermandadById, navigate])

  const duration = useMemo(() => {
    if (!hermandad) return null
    const exit = hermandad.exitTime
    const entry = hermandad.entryTime
    if (!exit || !entry) return null
    if (exit.includes('--') || entry.includes('--')) return null
    const [h1, m1] = exit.split(':').map(Number)
    const [h2, m2] = entry.split(':').map(Number)
    if ([h1, m1, h2, m2].some(n => Number.isNaN(n))) return null
    let diff = (h2 * 60 + m2) - (h1 * 60 + m1)
    if (diff < 0) diff += 24 * 60
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60
    return `${hours}h ${minutes.toString().padStart(2, '0')}m`
  }, [hermandad])

  const pasosInfo = useMemo(() => {
    if (!hermandad) return { numero: 0, images: [] as string[] }
    // Si vienen datos ya (futuros), úsalos
    const numero = hermandad.numeroPasos || 2 // suposición mínima
    const provided = hermandad.pasosImages && hermandad.pasosImages.length > 0 ? hermandad.pasosImages : []
    // Generar placeholders si faltan
    const placeholdersNeeded = Math.max(0, numero - provided.length)
    const placeholderImages = Array.from({ length: placeholdersNeeded }).map(() => `/assets/images/paso-placeholder.svg`)
    return { numero, images: [...provided, ...placeholderImages].slice(0, numero) }
  }, [hermandad])

  const timeline = useMemo(() => {
    if (!hermandad) return [] as { id: number; text: string }[]
    return hermandad.itinerary.map((street, idx) => ({ id: idx + 1, text: street }))
  }, [hermandad])

  const [showFullTimeline, setShowFullTimeline] = useState(false)
  const MAX_COLLAPSED = 5
  const visibleTimeline = showFullTimeline ? timeline : timeline.slice(0, MAX_COLLAPSED)
  const isCollapsible = timeline.length > MAX_COLLAPSED

  if (loading || !hermandad) return <LoadingSpinner />

  return (
    <div className="hermandad-detail-wrapper page-content">
      {/* Hero */}
      <div className="hero-hermandad position-relative">
  <div className="hero-bg" style={{ backgroundImage: `url(${hermandad.mainImage && hermandad.mainImage.trim() !== '' ? hermandad.mainImage : '/assets/images/main-placeholder.svg'})` }} aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-content container">
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4">
            <div className="d-flex align-items-center gap-4 hero-identidad">
              <img className="hero-escudo" src={hermandad.shieldUrl && hermandad.shieldUrl.trim() !== '' ? hermandad.shieldUrl : '/assets/images/shield-placeholder.svg'} alt={`Escudo de ${hermandad.name}`} onError={(e) => {
                const el = e.currentTarget as HTMLImageElement
                if (!el.dataset.fallback) { el.dataset.fallback = '1'; el.src = '/assets/images/shield-placeholder.svg' }
              }} />
              <div>
                <h1 className="hero-title mb-1">{hermandad.name}</h1>
                <p className="hero-subtitle mb-2">{hermandad.day}</p>
                <ul className="list-inline hero-meta mb-0">
                  <li className="list-inline-item"><strong>Salida:</strong> {hermandad.exitTime && hermandad.exitTime.trim() !== '' ? hermandad.exitTime : '--:--'} h</li>
                  <li className="list-inline-item"><strong>Entrada:</strong> {hermandad.entryTime && hermandad.entryTime.trim() !== '' ? hermandad.entryTime : '--:--'} h</li>
                  {duration && <li className="list-inline-item"><strong>Duración:</strong> {duration}</li>}
                  {hermandad.times?.carreraOficial && (
                    <li className="list-inline-item"><strong>CO:</strong> {hermandad.times.carreraOficial} h</li>
                  )}
                  {hermandad.times?.entradaSantaCruz && (
                    <li className="list-inline-item"><strong>Sta. Cruz:</strong> {hermandad.times.entradaSantaCruz} h</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-2 hero-actions">
              <button
                aria-label={hermandad.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                className={`btn btn-lg ${hermandad.isFavorite ? 'btn-secondary' : 'btn-primary'}`}
                onClick={() => toggleFavorite(hermandad.id)}
              >{hermandad.isFavorite ? '★ Favorito' : '☆ Añadir Favorito'}</button>
              <button className="btn btn-outline-light btn-lg" onClick={() => navigate(-1)} aria-label="Volver">Volver</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="detail-grid">
          {/* COLUMNA IZQUIERDA */}
          <div className="detail-column">
            {/* Metadatos / Descripción */}
            <div className="card detail-card tile" aria-labelledby="desc-title">
          <div className="card-header-custom" id="desc-title">Información</div>
          <div className="card-body">
            {/* Título completo y fundación */}
            {(hermandad.tituloCompleto || hermandad.anoFundacion || hermandad.webOficial) && (
              <div className="mb-4 p-3 rounded-3" style={{ background: '#f8f4ff', border: '1px solid #e5d4ff' }}>
                {hermandad.tituloCompleto && (
                  <h6 className="mb-2" style={{ color: '#6a1b9a', fontWeight: 600, fontSize: '0.95rem' }}>
                    {hermandad.tituloCompleto}
                  </h6>
                )}
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  {hermandad.anoFundacion && (
                    <div className="small">
                      <span className="text-muted">Fundación:</span> <strong>{hermandad.anoFundacion}</strong>
                    </div>
                  )}
                  {hermandad.webOficial && hermandad.webOficial !== 'Información no encontrada' && (
                    <div className="small">
                      <a 
                        href={hermandad.webOficial.startsWith('http') ? hermandad.webOficial : `https://${hermandad.webOficial}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        style={{ color: '#6a1b9a' }}
                      >
                        🌐 Web oficial →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="row g-3 mb-3">
              {hermandad.iglesia && (
                <div className="col-md-4">
                  <div className="p-3 rounded-3 border h-100" style={{ background: '#f8f4ff' }}>
                    <div className="small text-muted text-uppercase fw-bold mb-1">Sede canónica</div>
                    <div className="fw-semibold">{hermandad.iglesia}</div>
                  </div>
                </div>
              )}
              {hermandad.lugarSalidaEntrada && (
                <div className="col-md-4">
                  <div className="p-3 rounded-3 border h-100" style={{ background: '#fffaf0' }}>
                    <div className="small text-muted text-uppercase fw-bold mb-1">Salida / entrada</div>
                    <div className="fw-semibold">{hermandad.lugarSalidaEntrada}</div>
                  </div>
                </div>
              )}
              {hermandad.fecha && (
                <div className="col-md-4">
                  <div className="p-3 rounded-3 border h-100" style={{ background: '#f0fff8' }}>
                    <div className="small text-muted text-uppercase fw-bold mb-1">Fecha</div>
                    <div className="fw-semibold">{hermandad.fecha}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

            {/* Pasos con detalle */}
            <div className="card detail-card tile" aria-labelledby="pasos-title">
          <div className="card-header-custom" id="pasos-title">Pasos ({hermandad.pasos?.length || pasosInfo.numero})</div>
          <div className="card-body">
            {(!hermandad.pasos || hermandad.pasos.length === 0) && pasosInfo.numero === 0 && (
              <p className="mb-0">Sin información de pasos.</p>
            )}

            {hermandad.pasos && hermandad.pasos.length > 0 && (
              <div className="row g-3">
                {hermandad.pasos.map((p, idx) => (
                  <div className="col-md-6" key={idx}>
                    <div className="p-3 border rounded-3 h-100" style={{ background: '#faf7ff' }}>
                      <div className="d-flex align-items-start gap-3 mb-2">
                        <div className="position-relative flex-shrink-0" style={{ width: 72, height: 48 }}>
                          <img
                            src={(hermandad.pasosImages && hermandad.pasosImages[idx]) || '/assets/images/paso-placeholder.svg'}
                            alt={`Paso ${idx + 1} - ${p.nombre}`}
                            className="rounded shadow-sm" style={{ objectFit: 'cover', width: '72px', height: '48px' }}
                            onError={(e) => {
                              const el = e.currentTarget as HTMLImageElement
                              if (!el.dataset.fallback) { el.dataset.fallback = '1'; el.src = '/assets/images/paso-placeholder.svg' }
                            }}
                          />
                          <span className="badge rounded-pill position-absolute" style={{ top: '-6px', left: '-6px', background: '#6a1b9a', zIndex: 10 }}>{idx + 1}</span>
                        </div>
                        <h6 className="mb-0 fw-bold flex-grow-1" style={{ color: '#1a1a1a', lineHeight: '1.3' }}>{p.nombre}</h6>
                      </div>
                      {(p.descripcion || p.descripcion_imagen) && (
                        <p className="mb-2 small" style={{ color: '#333' }}>{p.descripcion || p.descripcion_imagen}</p>
                      )}
                      <ul className="list-unstyled small mb-0">
                        {p.tunica_nazarenos && (
                          <li className="mb-1"><strong>Hábito:</strong> {p.tunica_nazarenos}</li>
                        )}
                        {p.costaleros !== undefined && (
                          <li className="mb-1"><strong>Costaleros:</strong> {String(p.costaleros)}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fallback visual de grid si no hay detalle de pasos */}
            {(!hermandad.pasos || hermandad.pasos.length === 0) && pasosInfo.numero > 0 && (
              <div className="pasos-grid mt-2">
                {pasosInfo.images.map((img, idx) => (
                  <div key={idx} className="paso-item">
                    <div className="paso-thumb-wrapper">
                      <img src={img} alt={`Paso ${idx + 1} de ${hermandad.name}`} className="paso-thumb" />
                      <span className="paso-badge">{idx + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <small className="text-muted d-block mt-2">Música: {hermandad.music || 'Sin especificar'}. Imágenes orientativas si faltan recursos.</small>
          </div>
        </div>
          </div>
          {/* FIN COLUMNA IZQUIERDA */}

          {/* COLUMNA DERECHA */}
          <div className="detail-column">
            {/* Itinerario */}
            <div className="card detail-card tile" aria-labelledby="itinerario-title">
              <div className="card-header-custom" id="itinerario-title">Itinerario</div>
              <div className="card-body">
                {timeline.length === 0 && <p className="mb-0">Sin itinerario disponible.</p>}
                {timeline.length > 0 && (
                  <div className={`timeline-wrapper ${!showFullTimeline && isCollapsible ? 'collapsed' : ''}`}>
                    <ol className="timeline-itinerary">
                      {visibleTimeline.map(node => (
                        <li key={node.id} className="timeline-item">
                          <div className="timeline-marker" aria-hidden="true" />
                          <div className="timeline-content">
                            <span className="timeline-index">{node.id}</span>
                            <span className="timeline-text">{node.text}</span>
                          </div>
                        </li>
                      ))}
                    </ol>
                    {(!showFullTimeline && isCollapsible) && <div className="timeline-fade" aria-hidden="true" />}
                  </div>
                )}
                {isCollapsible && (
                  <div className="mt-3 text-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setShowFullTimeline(v => !v)}
                      aria-expanded={showFullTimeline}
                      aria-controls="itinerario-title"
                    >{showFullTimeline ? 'Ver menos' : `Ver más (${timeline.length - MAX_COLLAPSED} más)`}</button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* FIN COLUMNA DERECHA */}
        </div>

        {/* Mapa - fuera del grid, ancho completo */}
        {timeline.length > 0 && (
          <div className="card detail-card mt-4" aria-labelledby="mapa-title">
            <div className="card-header-custom" id="mapa-title">Mapa</div>
            <div className="card-body">
              <ItineraryMap itinerary={hermandad.itinerary} name={hermandad.name} />
              <small className="text-muted d-block mt-2">Trazado aproximado. Puede diferir del recorrido real.</small>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
