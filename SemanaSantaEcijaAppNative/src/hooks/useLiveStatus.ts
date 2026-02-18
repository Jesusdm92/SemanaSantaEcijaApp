import { useState, useEffect, useCallback } from 'react'
import { StatusJSON } from '../types/incidencias'
import { LIVE_STATUS_URL } from '../utils/constants'

/**
 * Hook que consulta el estado de incidencias desde el Gist cada 60s.
 * Solo se usa para mostrar datos en la UI (banners de alerta).
 * Las notificaciones push las gestiona n8n → Expo Push API.
 */
export function useLiveStatus() {
    const [data, setData] = useState<StatusJSON | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const fetchStatus = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        if (!LIVE_STATUS_URL || LIVE_STATUS_URL.includes('TuUsuario')) {
            console.log('Live Status URL not configured yet')
            setIsLoading(false)
            return
        }

        try {
            // Cache busting con timestamp para asegurar datos frescos
            const res = await fetch(`${LIVE_STATUS_URL}?t=${Date.now()}`)
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }
            const json: StatusJSON = await res.json()
            setData(json)
        } catch (e) {
            console.warn('Error fetching live status', e)
            setError(e instanceof Error ? e : new Error('Unknown error fetching live status'))
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStatus()
        // Polling cada 60 segundos para mantener la UI actualizada
        const interval = setInterval(fetchStatus, 60000)
        return () => clearInterval(interval)
    }, [fetchStatus])

    return {
        incidencias: data?.alerts || {},
        globalAlert: data?.global,
        lastUpdated: data?.meta.lastUpdated,
        isLoading,
        error,
        refetch: fetchStatus
    }
}

