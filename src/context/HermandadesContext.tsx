import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Hermandad } from '@/types/hermandad'

interface Ctx {
  hermandades: Hermandad[]
  loading: boolean
  getHermandades: () => Hermandad[]
  getHermandadById: (id: number | string) => Hermandad | undefined
  toggleFavorite: (id: number) => void
}

const HermandadesContext = createContext<Ctx | null>(null)

export function HermandadesProvider({ children }: { children: React.ReactNode }) {
  const [hermandades, setHermandades] = useState<Hermandad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const year = (import.meta as any).env?.VITE_AGENDA_YEAR || '2025'
        const primaryUrl = `/data/hermandades-${year}.json`
        const fallbackUrl = `/data/hermandades.json`

        let res = await fetch(primaryUrl)
        if (!res.ok) {
          console.warn(`No se encontró ${primaryUrl}, usando fallback ${fallbackUrl}`)
          res = await fetch(fallbackUrl)
        }
        const data: Hermandad[] = await res.json()
        const favoriteIds: number[] = JSON.parse(localStorage.getItem('ss_ecija_favorites') || '[]')
        const synced = data.map(h => ({ ...h, isFavorite: favoriteIds.includes(h.id) }))
        if (!cancelled) setHermandades(synced)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const getHermandades = () => hermandades
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
    () => ({ hermandades, loading, getHermandades, getHermandadById, toggleFavorite }),
    [hermandades, loading]
  )

  return <HermandadesContext.Provider value={value}>{children}</HermandadesContext.Provider>
}

export function useHermandades() {
  const ctx = useContext(HermandadesContext)
  if (!ctx) throw new Error('useHermandades must be used within a HermandadesProvider')
  return ctx
}
