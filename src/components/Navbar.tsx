import { NavLink, Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top" style={{ backgroundColor: 'var(--primary-color)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/hermandades">
          <img src="/assets/images/logo.png" alt="Logo Semana Santa Écija" width={36} height={36} className="rounded-circle shadow-sm" />
          <span className="brand-title">Semana Santa Écija</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center gap-2" to="/hermandades">
                <i className="bi bi-house-door"></i>
                <span>Inicio</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center gap-2" to="/agenda">
                <i className="bi bi-journal-check"></i>
                <span>Agenda Cofrade</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center gap-2" to="/hoy">
                <i className="bi bi-sun"></i>
                <span>Hoy sale…</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center gap-2" to="/favoritos">
                <i className="bi bi-star"></i>
                <span>Favoritos</span>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link d-flex align-items-center gap-2" to="/about">
                <i className="bi bi-info-circle"></i>
                <span>Acerca de</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
