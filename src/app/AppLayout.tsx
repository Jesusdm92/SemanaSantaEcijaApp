import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import NotificationsBanner from '@/components/NotificationsBanner'

export default function AppLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <NotificationsBanner />
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="text-center py-4 mt-5 app-footer">
        <div className="container">
          <p className="mb-0">&copy; 2026 Cruz de Guía Écija.</p>
          <p className="mb-0 small mt-2">
            Contacto / Soporte: <a href="mailto:jesusdelmar11@icloud.com" className="text-decoration-none text-light">jesusdelmar11@icloud.com</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
