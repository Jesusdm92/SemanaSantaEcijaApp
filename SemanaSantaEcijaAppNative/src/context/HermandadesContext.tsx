import React, { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Hermandad } from '@mobile/types/hermandad'

import { Incidencia, IncidenciaType } from '../types/incidencias'
import { useLiveStatus } from '../hooks/useLiveStatus'

// Intentamos cargar el dataset 2025 si existe; si falla, caemos al base
let hermandadesData: any
try {
  hermandadesData = require('../../assets/data/hermandades-2025.json')
} catch (e) {
  hermandadesData = require('../../assets/data/hermandades.json')
}

interface HermandadesContextValue {
  hermandades: Hermandad[]
  getHermandades: () => Hermandad[]
  getHermandadById: (id: number) => Hermandad | undefined
  toggleFavorite: (id: number) => Promise<void>
  loading: boolean
  // Incidencias en tiempo real
  incidencias: Record<string, Incidencia>
  globalAlert?: { active: boolean; message: string; type: IncidenciaType }
}

const FAVORITES_KEY = 'SS_ECIJA_FAVORITES'

const HermandadesContext = createContext<HermandadesContextValue | undefined>(undefined)

export const HermandadesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hermandades, setHermandades] = useState<Hermandad[]>([])
  const [loading, setLoading] = useState(true)

  // Hook de estado en vivo (polling automático)
  const { incidencias, globalAlert } = useLiveStatus()

  useEffect(() => {
    ; (async () => {
      try {
        const baseRaw = (hermandadesData as Hermandad[])
        const base: Hermandad[] = baseRaw.map(h => ({ ...h, isFavorite: !!h.isFavorite }))
        const favRaw = await AsyncStorage.getItem(FAVORITES_KEY)
        const favs: Record<string, boolean> = favRaw ? JSON.parse(favRaw) : {}
        const merged = base.map(h => ({ ...h, isFavorite: !!favs[h.id] }))
        setHermandades(merged)
      } catch (e) {
        console.warn('Error cargando hermandades', e)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const persistFavorites = async (list: Hermandad[]) => {
    const map: Record<string, boolean> = {}
    list.forEach(h => { if (h.isFavorite) map[h.id] = true })
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(map))
  }

  const getHermandades = () => hermandades
  const getHermandadById = (id: number) => hermandades.find(h => h.id === id)
  const toggleFavorite = async (id: number) => {
    const updated = hermandades.map(h => h.id === id ? { ...h, isFavorite: !h.isFavorite } : h)
    setHermandades(updated)
    await persistFavorites(updated)
  }

  return (
    <HermandadesContext.Provider value={{ hermandades, getHermandades, getHermandadById, toggleFavorite, loading, incidencias, globalAlert }}>
      {children}
    </HermandadesContext.Provider>
  )
}

export const useHermandades = () => {
  const ctx = useContext(HermandadesContext)
  if (!ctx) throw new Error('useHermandades debe usarse dentro de HermandadesProvider')
  return ctx
}
