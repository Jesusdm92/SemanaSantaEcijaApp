import AsyncStorage from '@react-native-async-storage/async-storage'
import { Hermandad } from '../types/hermandad'
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_HERMANDADES_TABLE } from '../utils/constants'

// Datos locales como fallback final
const localFallbackData = require('../../assets/data/hermandades.json')

/** Clave de cache en AsyncStorage */
const CACHE_KEY = 'SS_ECIJA_HERMANDADES_CACHE'
const CACHE_TIMESTAMP_KEY = 'SS_ECIJA_HERMANDADES_CACHE_TS'

/** Tiempo máximo de cache: 24 horas */
const CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000

/** Orden cronológico de los días de Semana Santa */
const DAY_ORDER: Record<string, number> = {
    'Viernes de Dolores': 1,
    'Sábado de Pasión': 2,
    'Domingo de Ramos': 3,
    'Lunes Santo': 4,
    'Martes Santo': 5,
    'Miércoles Santo': 6,
    'Jueves Santo': 7,
    'Madrugada': 8,
    'Viernes Santo': 9,
    'Sábado Santo': 10,
    'Domingo de Resurrección': 11,
}

/**
 * Ordena las hermandades cronológicamente por día y hora de salida.
 */
function sortHermandades(list: Hermandad[]): Hermandad[] {
    return [...list].sort((a, b) => {
        const orderA = DAY_ORDER[a.day] || 99
        const orderB = DAY_ORDER[b.day] || 99

        if (orderA !== orderB) {
            return orderA - orderB
        }

        // Si es el mismo día, ordenamos por hora de salida
        return a.exitTime.localeCompare(b.exitTime)
    })
}

export type DataSource = 'remote' | 'cache' | 'local'

interface HermandadesResult {
    data: Hermandad[]
    source: DataSource
}

/**
 * Transforma una fila de Supabase (snake_case) al tipo Hermandad (camelCase).
 */
function mapSupabaseRow(row: any): Hermandad {
    return {
        id: row.id,
        name: row.name,
        day: row.day,
        exitTime: row.exit_time,
        entryTime: row.entry_time,
        shieldUrl: row.shield_url,
        mainImage: row.main_image,
        itinerary: row.itinerary || [],
        description: row.description || '',
        colors: row.colors,
        music: row.music,
        isFavorite: false, // Los favoritos se gestionan localmente
        numeroPasos: row.numero_pasos,
        pasosImages: row.pasos_images || [],
        pasos: row.pasos || [],
        times: row.times,
        iglesia: row.iglesia,
        lugarSalidaEntrada: row.lugar_salida_entrada,
        fecha: row.fecha,
        tituloCompleto: row.titulo_completo,
        anoFundacion: row.ano_fundacion,
        webOficial: row.web_oficial,
    }
}

/**
 * Obtiene hermandades desde la API REST de Supabase.
 * @throws Error si la petición falla
 */
async function fetchFromSupabase(): Promise<Hermandad[]> {
    const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_HERMANDADES_TABLE}?select=*&order=id.asc`

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
    })

    if (!res.ok) {
        throw new Error(`Supabase HTTP ${res.status}: ${await res.text()}`)
    }

    const rows: any[] = await res.json()
    return rows.map(mapSupabaseRow)
}

/**
 * Guarda hermandades en AsyncStorage como cache.
 */
async function cacheHermandades(data: Hermandad[]): Promise<void> {
    try {
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data))
        await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (e) {
        console.warn('Error guardando cache de hermandades:', e)
    }
}

/**
 * Lee hermandades del cache de AsyncStorage.
 * Devuelve null si no hay cache o ha expirado.
 */
async function getCachedHermandades(): Promise<Hermandad[] | null> {
    try {
        const tsStr = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY)
        if (!tsStr) return null

        const ts = parseInt(tsStr, 10)
        if (Date.now() - ts > CACHE_MAX_AGE_MS) {
            // Cache expirada
            return null
        }

        const raw = await AsyncStorage.getItem(CACHE_KEY)
        if (!raw) return null

        return JSON.parse(raw) as Hermandad[]
    } catch (e) {
        console.warn('Error leyendo cache de hermandades:', e)
        return null
    }
}

/**
 * Obtiene las hermandades del JSON local bundled (fallback final).
 */
function getLocalFallback(): Hermandad[] {
    return (localFallbackData as Hermandad[]).map((h) => ({
        ...h,
        isFavorite: false,
    }))
}

/**
 * Obtiene las hermandades con la siguiente prioridad:
 * 1. Supabase (remoto) — si hay conexión
 * 2. Cache (AsyncStorage) — si hay datos cacheados válidos
 * 3. JSON local bundled — siempre disponible
 */
export async function getHermandades(): Promise<HermandadesResult> {
    // 1. Intentar remoto
    try {
        const remoteRaw = await fetchFromSupabase()
        if (remoteRaw.length > 0) {
            const remote = sortHermandades(remoteRaw)
            // Cachear en background
            cacheHermandades(remote).catch(() => { })
            if (__DEV__) console.log(`📡 Hermandades cargadas desde Supabase (${remote.length})`)
            return { data: remote, source: 'remote' }
        }
    } catch (e) {
        console.warn('⚠️ No se pudo conectar con Supabase:', e)
    }

    // 2. Intentar cache
    try {
        const cachedRaw = await getCachedHermandades()
        if (cachedRaw && cachedRaw.length > 0) {
            const cached = sortHermandades(cachedRaw)
            if (__DEV__) console.log(`💾 Hermandades cargadas del cache (${cached.length})`)
            return { data: cached, source: 'cache' }
        }
    } catch (e) {
        console.warn('⚠️ Error leyendo cache:', e)
    }

    // 3. Fallback a datos locales
    const local = sortHermandades(getLocalFallback())
    if (__DEV__) console.log(`📦 Hermandades cargadas del JSON local (${local.length})`)
    return { data: local, source: 'local' }
}
