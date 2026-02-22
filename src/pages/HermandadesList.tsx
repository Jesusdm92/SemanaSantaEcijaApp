import { useHermandades } from '@/context/HermandadesContext'
import HermandadCard from '@/components/HermandadCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import SeoHead from '@/components/SeoHead'

export default function HermandadesList() {
  const { hermandades, loading } = useHermandades()
  if (loading) return <LoadingSpinner />

  return (
    <>
      <SeoHead
        title="Hermandades y Cofradías"
        description="Explora todas las hermandades y cofradías de la Semana Santa de Écija 2025: horarios de salida, entrada, itinerarios y mucho más."
        url="/hermandades"
      />
      <div className="container my-5 page-content hermandades-list">
        <h1 className="text-center mb-5 page-title">Hermandades y Cofradías</h1>
        <div className="row">
          {hermandades.map(h => <HermandadCard key={h.id} hermandad={h} />)}
        </div>
      </div>
    </>
  )
}


