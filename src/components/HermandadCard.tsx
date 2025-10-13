import { Link } from 'react-router-dom'
import type { Hermandad } from '@/types/hermandad'

export default function HermandadCard({ hermandad }: { hermandad: Hermandad }) {
  const shieldSrc = hermandad.shieldUrl && hermandad.shieldUrl.trim() !== ''
    ? hermandad.shieldUrl
    : '/assets/images/shield-placeholder.svg'
  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card hermandad-card h-100">
        <div className="card-header-custom">
          <h5 className="card-title mb-0 text-white">{hermandad.name}</h5>
        </div>
        <img src={shieldSrc} className="card-img-top" alt={`Escudo de ${hermandad.name}`} onError={(e) => {
          const el = e.currentTarget as HTMLImageElement
          if (!el.dataset.fallback) {
            el.dataset.fallback = '1'
            el.src = '/assets/images/shield-placeholder.svg'
          }
        }} />
        <div className="card-body d-flex flex-column">
          <p className="card-text d-flex align-items-center justify-content-center gap-2"><strong className="me-1">{hermandad.day}</strong> <i className="bi bi-calendar-event"></i></p>
          <div className="text-muted small d-flex flex-column gap-1">
            <div className="d-flex align-items-center gap-2 justify-content-center">
              <i className="bi bi-box-arrow-right" aria-hidden></i>
              <span><strong>Salida:</strong> {(hermandad.exitTime && hermandad.exitTime.trim() !== '' ? hermandad.exitTime : '--:--')}h</span>
            </div>
            <div className="d-flex align-items-center gap-2 justify-content-center">
              <i className="bi bi-box-arrow-in-right" aria-hidden></i>
              <span><strong>Entrada:</strong> {(hermandad.entryTime && hermandad.entryTime.trim() !== '' ? hermandad.entryTime : '--:--')}h</span>
            </div>
          </div>
          <div className="mt-auto">
            <Link to={`/hermandades/${hermandad.id}`} className="btn btn-primary" aria-label={`Ver detalle de ${hermandad.name}`}>
              Ver Detalle
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
