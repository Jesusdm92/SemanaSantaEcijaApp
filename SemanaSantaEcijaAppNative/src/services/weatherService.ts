/**
 * Servicio de previsión meteorológica para Écija usando Open-Meteo (gratuito, sin API key).
 * Caché en memoria de 30 minutos para evitar llamadas repetidas.
 */

// Coordenadas de Écija (Sevilla)
const LAT = 37.542
const LON = -5.082
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutos

export interface DayForecast {
    date: string           // ISO "2026-02-17"
    dayName: string        // "Lun", "Mar", …
    weatherCode: number    // WMO code
    weatherEmoji: string   // ☀️, 🌧️, …
    weatherLabel: string   // "Despejado", "Lluvia", …
    tempMax: number        // °C
    tempMin: number        // °C
    precipProb: number     // 0-100 %
}

// ---------- WMO weather-code mapping ----------

const WMO_MAP: Record<number, { emoji: string; label: string }> = {
    0: { emoji: '☀️', label: 'Despejado' },
    1: { emoji: '🌤️', label: 'Casi despejado' },
    2: { emoji: '⛅', label: 'Parcialmente nublado' },
    3: { emoji: '☁️', label: 'Nublado' },
    45: { emoji: '🌫️', label: 'Niebla' },
    48: { emoji: '🌫️', label: 'Niebla dep.' },
    51: { emoji: '🌦️', label: 'Llovizna ligera' },
    53: { emoji: '🌦️', label: 'Llovizna' },
    55: { emoji: '🌦️', label: 'Llovizna intensa' },
    56: { emoji: '🌧️', label: 'Llovizna helada' },
    57: { emoji: '🌧️', label: 'Llovizna helada int.' },
    61: { emoji: '🌧️', label: 'Lluvia ligera' },
    63: { emoji: '🌧️', label: 'Lluvia' },
    65: { emoji: '🌧️', label: 'Lluvia intensa' },
    66: { emoji: '🌧️', label: 'Lluvia helada' },
    67: { emoji: '🌧️', label: 'Lluvia helada int.' },
    71: { emoji: '🌨️', label: 'Nieve ligera' },
    73: { emoji: '🌨️', label: 'Nieve' },
    75: { emoji: '🌨️', label: 'Nieve intensa' },
    77: { emoji: '🌨️', label: 'Granizo' },
    80: { emoji: '🌦️', label: 'Chubascos ligeros' },
    81: { emoji: '🌧️', label: 'Chubascos' },
    82: { emoji: '🌧️', label: 'Chubascos fuertes' },
    85: { emoji: '🌨️', label: 'Nieve ligera' },
    86: { emoji: '🌨️', label: 'Nieve intensa' },
    95: { emoji: '⛈️', label: 'Tormenta' },
    96: { emoji: '⛈️', label: 'Tormenta con granizo' },
    99: { emoji: '⛈️', label: 'Tormenta con granizo int.' },
}

function wmoToEmoji(code: number): { emoji: string; label: string } {
    return WMO_MAP[code] ?? { emoji: '❓', label: 'Desconocido' }
}

// ---------- Nombres de día en español ----------

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function spanishDayName(iso: string): string {
    const d = new Date(iso + 'T12:00:00') // mediodía para evitar desfases UTC
    return DAY_NAMES[d.getDay()]
}

// ---------- Caché ----------

let cache: { data: DayForecast[]; ts: number } | null = null

// ---------- Fetch ----------

export async function fetchWeatherForecast(): Promise<DayForecast[]> {
    // Devolver caché si aún es válida
    if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
        return cache.data
    }

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${LAT}&longitude=${LON}` +
        `&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=Europe/Madrid&forecast_days=7`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`Weather API ${res.status}`)

    const json = await res.json()
    const d = json.daily

    const forecasts: DayForecast[] = (d.time as string[]).map((iso: string, i: number) => {
        const { emoji, label } = wmoToEmoji(d.weathercode[i])
        return {
            date: iso,
            dayName: spanishDayName(iso),
            weatherCode: d.weathercode[i],
            weatherEmoji: emoji,
            weatherLabel: label,
            tempMax: Math.round(d.temperature_2m_max[i]),
            tempMin: Math.round(d.temperature_2m_min[i]),
            precipProb: d.precipitation_probability_max[i],
        }
    })

    cache = { data: forecasts, ts: Date.now() }
    return forecasts
}
