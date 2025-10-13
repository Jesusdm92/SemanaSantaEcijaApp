import Navbar from '@/components/Navbar'
import { Outlet } from 'react-router-dom'

export default function AppLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="text-center py-4 mt-5 app-footer">
        <div className="container">
          <p className="mb-0">&copy; 2025 Semana Santa Écija App. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
