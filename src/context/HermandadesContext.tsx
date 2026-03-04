import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Hermandad } from '@/types/hermandad'
import { getHermandades, type DataSource } from '@/services/hermandadesService'

interface Ctx {
  hermandades: Hermandad[]
  loading: boolean
  dataSource: DataSource | null
  getHermandades: () => Hermandad[]
  getHermandadById: (id: number | string) => Hermandad | undefined
  toggleFavorite: (id: number) => void
}

const HermandadesContext = createContext<Ctx | null>(null)

export function HermandadesProvider({ children }: { children: React.ReactNode }) {
  const [hermandades, setHermandades] = useState<Hermandad[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<DataSource | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const { data, source } = await getHermandades()
        const favoriteIds: number[] = JSON.parse(localStorage.getItem('ss_ecija_favorites') || '[]')
        const synced = data.map(h => ({ ...h, isFavorite: favoriteIds.includes(h.id) }))
        if (!cancelled) {
          setHermandades(synced)
          setDataSource(source)
        }
      } catch (e) {
        console.error('Error cargando hermandades:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const getHermandadesFn = () => hermandades
  const getHermandadById = (id: number | string) => hermandades.find(h => h.id === Number(id))

  const toggleFavorite = (id: number) => {
    setHermandades(prev => {
      const updated = prev.map(h => (h.id === id ? { ...h, isFavorite: !h.isFavorite } : h))
      const favorites = updated.filter(h => h.isFavorite).map(h => h.id)
      localStorage.setItem('ss_ecija_favorites', JSON.stringify(favorites))
      return updated
    })
  }

  const value = useMemo(
    () => ({ hermandades, loading, dataSource, getHermandades: getHermandadesFn, getHermandadById, toggleFavorite }),
    [hermandades, loading, dataSource]
  )

  return <HermandadesContext.Provider value={value}>{children}</HermandadesContext.Provider>
}

export function useHermandades() {
  const ctx = useContext(HermandadesContext)
  if (!ctx) throw new Error('useHermandades must be used within a HermandadesProvider')
  return ctx
}
