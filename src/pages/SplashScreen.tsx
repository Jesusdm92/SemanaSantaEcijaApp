import { useNavigate } from 'react-router-dom'

export default function SplashScreen() {
  const navigate = useNavigate()
  const handleEnter = () => navigate('/hermandades')

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <h1>Semana Santa de Écija</h1>
        <p className="lead mb-4">Vive la pasión, descubre las tradiciones.</p>
        <button className="btn btn-secondary btn-lg" onClick={handleEnter}>Entrar</button>
      </div>
    </div>
  )
}
