import { createClient } from '@supabase/supabase-js'
import type { Hermandad } from '@/types/hermandad'

// Fallback data
import localData from '../../public/data/hermandades-2025.json'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export type DataSource = 'remote' | 'cache' | 'local'

const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

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
        isFavorite: false,
        numeroPasos: row.numero_pasos,
        pasosImages: row.pasos_images || [],
        // Use row.pasos if available, otherwise check local data? 
        // Actually, for Web, we might want to prioritize localData if Supabase is empty, similar to Native.
        pasos: (row.pasos && row.pasos.length > 0) ? row.pasos : (localData.find((h: any) => h.id === row.id)?.pasos || []),
        times: row.times,
        iglesia: row.iglesia,
        lugarSalidaEntrada: row.lugar_salida_entrada,
        fecha: row.fecha,
        tituloCompleto: row.titulo_completo,
        anoFundacion: row.ano_fundacion,
        webOficial: row.web_oficial,
    }
}

export async function getHermandades(): Promise<{ data: Hermandad[]; source: DataSource }> {
    try {
        const { data: rows, error } = await client
            .from('hermandades')
            .select('*')
            .order('id', { ascending: true })

        if (error) throw error
        if (rows && rows.length > 0) {
            // Map and return
            return {
                data: rows.map(mapSupabaseRow),
                source: 'remote'
            }
        }
    } catch (e) {
        console.warn('Supabase fetch failed, falling back to local:', e)
    }

    // Fallback to local
    return {
        data: (localData as any[]).map(h => ({ ...h, isFavorite: false })),
        source: 'local'
    }
}
