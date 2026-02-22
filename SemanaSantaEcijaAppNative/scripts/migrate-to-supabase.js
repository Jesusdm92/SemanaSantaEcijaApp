/**
 * Script de migración: hermandades-2025.json → Supabase
 *
 * Uso:
 *   node scripts/migrate-to-supabase.js
 *
 * Requisitos:
 *   - La tabla `hermandades` ya debe existir en Supabase (ejecutar supabase-schema.sql antes)
 *   - Configurar SUPABASE_URL y SUPABASE_ANON_KEY abajo (o como variables de entorno)
 */

const fs = require('fs')
const path = require('path')

// ── Cargar variables de entorno desde .env ──────────────────────
try {
    const envPath = path.join(__dirname, '..', '.env')
    if (fs.existsSync(envPath)) {
        const envFile = fs.readFileSync(envPath, 'utf-8')
        envFile.split('\n').forEach(line => {
            const [key, ...value] = line.split('=')
            if (key && value) process.env[key.trim()] = value.join('=').trim()
        })
    }
} catch (e) {
    console.warn('⚠️ No se pudo cargar el archivo .env')
}

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const TABLE = 'hermandades'

// Usamos la Service Role Key si existe para saltar RLS, si no, usamos la Anon Key
const API_KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY

if (!SUPABASE_URL || !API_KEY) {
    console.error('❌ Error: Falta configuración en el archivo .env')
    process.exit(1)
}

if (SUPABASE_SERVICE_ROLE_KEY) {
    console.log('🔑 Usando llave maestra (service_role) para la migración.')
} else {
    console.log('⚠️ Usando llave pública (anon). Asegúrate de tener las políticas RLS abiertas en Supabase.')
}

// ── Cargar datos ───────────────────────────────────────────────
const dataPath = path.join(__dirname, '..', 'assets', 'data', 'hermandades.json')
const hermandades = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

console.log(`📖 Leídas ${hermandades.length} hermandades del fichero JSON`)

/**
 * Transforma camelCase del JSON a snake_case para Supabase
 */
function toSupabaseRow(h) {
    return {
        id: h.id,
        name: h.name,
        day: h.day,
        exit_time: h.exitTime,
        entry_time: h.entryTime,
        shield_url: h.shieldUrl || null,
        main_image: h.mainImage || null,
        itinerary: h.itinerary || [],
        description: h.description || '',
        colors: h.colors || '',
        music: h.music || '',
        is_favorite: false,
        numero_pasos: h.numeroPasos || 0,
        pasos_images: h.pasosImages || [],
        pasos: h.pasos || [],
        times: h.times || null,
        iglesia: h.iglesia || null,
        lugar_salida_entrada: h.lugarSalidaEntrada || null,
        fecha: h.fecha || null,
        titulo_completo: h.tituloCompleto || null,
        ano_fundacion: h.anoFundacion || null,
        web_oficial: h.webOficial || null,
    }
}

async function migrate() {
    const rows = hermandades.map(toSupabaseRow)

    console.log(`🚀 Enviando ${rows.length} registros a Supabase...`)

    // Upsert: si el id ya existe, actualiza; si no, inserta
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            apikey: API_KEY,
            Authorization: `Bearer ${API_KEY}`,
            Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify(rows),
    })

    if (!res.ok) {
        const errorText = await res.text()
        console.error(`❌ Error ${res.status}: ${errorText}`)
        process.exit(1)
    }

    console.log(`✅ Migración completada: ${rows.length} hermandades insertadas/actualizadas en Supabase`)
}

migrate().catch((err) => {
    console.error('❌ Error inesperado:', err)
    process.exit(1)
})
