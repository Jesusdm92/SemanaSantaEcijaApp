import { useHermandades } from '@/context/HermandadesContext'
import HermandadCard from '@/components/HermandadCard'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function Favoritos() {
  const { hermandades, loading } = useHermandades()
  const favoritos = hermandades.filter(h => h.isFavorite)
  if (loading) return <LoadingSpinner />

  return (
    <div className="container my-5 page-content">
      <h1 className="text-center mb-5 page-title">Mis Hermandades Favoritas</h1>
      {favoritos.length > 0 ? (
        <div className="row">
          {favoritos.map(h => (
            <HermandadCard key={h.id} hermandad={h} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="lead">Aún no has añadido ninguna hermandad a favoritos.</p>
          <p>Explora la lista de hermandades y marca tus preferidas con una estrella.</p>
        </div>
      )}
    </div>
  )
}
