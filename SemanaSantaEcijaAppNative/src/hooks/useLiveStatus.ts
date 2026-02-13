import { useState, useEffect } from 'react'
import { StatusJSON } from '../types/incidencias'
import { LIVE_STATUS_URL } from '../utils/constants'

export function useLiveStatus() {
    const [data, setData] = useState<StatusJSON | null>(null)

    const fetchStatus = async () => {
        try {
            // Cache busting con timestamp para asegurar datos frescos
            const res = await fetch(`${LIVE_STATUS_URL}?t=${Date.now()}`)
            if (!res.ok) return
            const json = await res.json()
            setData(json)
        } catch (e) {
            // Fallo silencioso en caso de error de red para no molestar al usuario
            console.log('Error fetching live status', e)
        }
    }

    useEffect(() => {
        fetchStatus()
        // Polling cada 60 segundos
        const interval = setInterval(fetchStatus, 60000)
        return () => clearInterval(interval)
    }, [])

    return {
        incidencias: data?.alerts || {},
        globalAlert: data?.global,
        lastUpdated: data?.meta.lastUpdated
    }
}
