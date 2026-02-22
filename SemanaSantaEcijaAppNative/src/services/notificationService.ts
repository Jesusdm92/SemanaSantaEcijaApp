import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SUPABASE_URL, SUPABASE_ANON_KEY, EAS_PROJECT_ID } from '../utils/constants'

/** Clave para almacenar el push token en AsyncStorage */
const PUSH_TOKEN_KEY = 'EXPO_PUSH_TOKEN'

/**
 * Configura el handler de notificaciones en primer plano
 * (para que se muestren incluso con la app abierta)
 */
export function configureForegroundHandler() {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: false,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    })
}

/**
 * Solicita permisos de notificación al usuario
 * @returns true si los permisos fueron concedidos
 */
export async function registerForNotifications(): Promise<boolean> {
    try {
        // Configurar canal en Android
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('alertas', {
                name: 'Alertas de Semana Santa',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#d4af37',
                sound: 'default',
            })
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }

        return finalStatus === 'granted'
    } catch (e) {
        console.warn('Error al registrar notificaciones:', e)
        return false
    }
}

/**
 * Envía una notificación local al dispositivo
 */
export async function sendLocalNotification(
    title: string,
    body: string,
    data?: Record<string, unknown>
): Promise<void> {
    try {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                sound: 'default',
                data: data || {},
            },
            trigger: null, // Inmediata
        })
    } catch (e) {
        console.warn('Error al enviar notificación:', e)
    }
}

// ─── Push Notifications (Expo Push + Supabase) ───────────────────

/**
 * Obtiene el Expo Push Token único de este dispositivo.
 * Requiere permisos concedidos y un build nativo (no funciona en web).
 * @returns El token (ej: "ExponentPushToken[xxxx]") o null si falla
 */
export async function getExpoPushToken(): Promise<string | null> {
    try {
        // Solo funciona en dispositivos nativos
        if (Platform.OS === 'web') {
            if (__DEV__) console.log('Push tokens no disponibles en web')
            return null
        }

        const { data } = await Notifications.getExpoPushTokenAsync({
            projectId: EAS_PROJECT_ID,
        })
        return data // Formato: "ExponentPushToken[xxxx]"
    } catch (e) {
        console.warn('Error obteniendo Expo Push Token:', e)
        return null
    }
}

/**
 * Registra el push token en Supabase (upsert por expo_push_token).
 * Si el token ya existe, actualiza la fecha; si no, crea un registro nuevo.
 */
export async function registerPushToken(token: string): Promise<void> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/push_tokens`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Prefer': 'resolution=merge-duplicates',
            },
            body: JSON.stringify({
                expo_push_token: token,
                platform: Platform.OS,
                updated_at: new Date().toISOString(),
            }),
        })

        if (!res.ok) {
            console.warn('Error registrando push token:', res.status, await res.text())
        } else {
            if (__DEV__) console.log('Push token registrado en Supabase correctamente')
        }
    } catch (e) {
        console.warn('Error de red registrando push token:', e)
    }
}

/**
 * Sincroniza las preferencias de notificación del usuario con Supabase.
 * n8n usará estas preferencias para filtrar a quién enviar cada push.
 */
export async function syncPreferencesToSupabase(
    token: string,
    prefs: { danger: boolean; warning: boolean; info: boolean; global: boolean }
): Promise<void> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/push_tokens?expo_push_token=eq.${encodeURIComponent(token)}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    prefs_danger: prefs.danger,
                    prefs_warning: prefs.warning,
                    prefs_info: prefs.info,
                    prefs_global: prefs.global,
                    updated_at: new Date().toISOString(),
                }),
            }
        )

        if (!res.ok) {
            console.warn('Error sincronizando preferencias:', res.status)
        }
    } catch (e) {
        console.warn('Error de red sincronizando preferencias:', e)
    }
}

/**
 * Guarda el push token localmente para poder sincronizar prefs después.
 */
export async function savePushTokenLocally(token: string): Promise<void> {
    try {
        await AsyncStorage.setItem(PUSH_TOKEN_KEY, token)
    } catch (e) {
        console.warn('Error guardando push token local:', e)
    }
}

/**
 * Obtiene el push token guardado localmente.
 */
export async function getLocalPushToken(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(PUSH_TOKEN_KEY)
    } catch (e) {
        console.warn('Error leyendo push token local:', e)
        return null
    }
}
