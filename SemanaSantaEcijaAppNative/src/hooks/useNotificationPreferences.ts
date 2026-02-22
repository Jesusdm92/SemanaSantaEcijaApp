import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocalPushToken, syncPreferencesToSupabase } from '../services/notificationService'

const PREFS_KEY = 'SS_ECIJA_NOTIFICATION_PREFS'

export interface NotificationPrefs {
    /** Avisos críticos (danger) — suspensiones, emergencias */
    danger: boolean
    /** Avisos generales (warning) — retrasos, cambios */
    warning: boolean
    /** Información (info) — novedades */
    info: boolean
    /** Avisos globales que afectan a todas las hermandades */
    global: boolean
}

const DEFAULT_PREFS: NotificationPrefs = {
    danger: true,
    warning: true,
    info: false,
    global: true,
}

export function useNotificationPreferences() {
    const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS)
    const [isLoading, setIsLoading] = useState(true)

    // Cargar preferencias al montar
    useEffect(() => {
        ; (async () => {
            try {
                const raw = await AsyncStorage.getItem(PREFS_KEY)
                if (raw) {
                    setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) })
                }
            } catch (e) {
                console.warn('Error cargando preferencias de notificación:', e)
            } finally {
                setIsLoading(false)
            }
        })()
    }, [])

    const togglePref = useCallback(async (key: keyof NotificationPrefs) => {
        setPrefs(prev => {
            const updated = { ...prev, [key]: !prev[key] }
            AsyncStorage.setItem(PREFS_KEY, JSON.stringify(updated)).catch(console.warn)
            // Sincronizar con Supabase en background para que n8n filtre correctamente
            getLocalPushToken().then(token => {
                if (token) syncPreferencesToSupabase(token, updated)
            }).catch(console.warn)
            return updated
        })
    }, [])

    const getPrefs = useCallback(async (): Promise<NotificationPrefs> => {
        try {
            const raw = await AsyncStorage.getItem(PREFS_KEY)
            if (raw) return { ...DEFAULT_PREFS, ...JSON.parse(raw) }
        } catch (e) {
            console.warn('Error leyendo preferencias:', e)
        }
        return DEFAULT_PREFS
    }, [])

    return { prefs, togglePref, isLoading, getPrefs }
}
