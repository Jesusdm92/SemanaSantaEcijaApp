// URL del Gist en GitHub (Raw) que actuará como backend
// REEMPLAZAR con tu URL real cuando configures el Gist
export const LIVE_STATUS_URL = 'https://gist.githubusercontent.com/Jesusdm92/68ec076a0229259df23eb5f073ec8c31/raw/status.json'

// Supabase (Free Tier) — almacenamiento de push tokens
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || ''
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''

// Tabla de hermandades en Supabase
export const SUPABASE_HERMANDADES_TABLE = 'hermandades'

// EAS Project ID — necesario para Expo Push Token
export const EAS_PROJECT_ID = '6e68a564-6466-4c27-bd38-25c6c2adc84f'
