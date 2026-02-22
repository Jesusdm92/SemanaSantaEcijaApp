/**
 * Analiza el texto de descripción del hábito nazareno
 * y extrae los colores de túnica, capillo y capa.
 *
 * Fuente: campo `tunica_nazarenos` de cada paso en hermandades.
 */

export interface NazarenoColors {
    tunic: string
    hood: string
    cape: string
}

const COLOR_MAP: Record<string, string> = {
    blanco: '#F2F2F2', blanca: '#F2F2F2', blancos: '#F2F2F2', blancas: '#F2F2F2',
    morado: '#5C2D91', morada: '#5C2D91', morados: '#5C2D91',
    negro: '#1A1A1A', negra: '#1A1A1A', negros: '#1A1A1A', negras: '#1A1A1A',
    rojo: '#C62828', roja: '#C62828', rojos: '#C62828',
    verde: '#2E7D32',
    azul: '#1565C0',
    celeste: '#64B5F6',
    marron: '#795548', marrón: '#795548',
    crema: '#FFF3C4',
    burdeos: '#880E4F',
    dorado: '#D4AF37', oro: '#D4AF37',
    granate: '#880E4F',
    gris: '#9E9E9E',
}

function normalize(text: string): string {
    return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function extractColor(segment: string): string | null {
    const words = segment.split(/[\s,;.]+/)
    for (const w of words) {
        const c = COLOR_MAP[w]
        if (c) return c
    }
    return null
}

export function parseNazarenoColors(
    colorsField?: string,
    tunicaNazarenos?: string,
): NazarenoColors {
    const raw = tunicaNazarenos || colorsField || ''
    if (!raw.trim()) {
        return { tunic: '#F2F2F2', hood: '#5C2D91', cape: '#F2F2F2' }
    }

    const text = normalize(raw)

    let tunic: string | null = null
    let hood: string | null = null
    let cape: string | null = null

    // 1. Patrón: "tunica, capa y capillo COLOR"
    const allSame = text.match(/tunica,\s*capa\s*y\s*capillo\s+(\w+)/)
    if (allSame) {
        const c = COLOR_MAP[allSame[1]]
        if (c) return { tunic: c, hood: c, cape: c }
    }

    // 2. Patrón: "tunica y capillo COLOR"
    const tunicHood = text.match(/tunica\s+y\s+capillo\s+(?:de\s+(?:color\s+)?)?(\w+)/)
    if (tunicHood) {
        const c = COLOR_MAP[tunicHood[1]]
        if (c) { tunic = c; hood = c }
    }

    // 3. Cláusulas individuales
    const clauses = text.split(/[,;.]/).map(c => c.trim()).filter(Boolean)

    for (const clause of clauses) {
        if (!tunic && /\b(tunica|tunicas)\b/.test(clause)) {
            const rest = clause.replace(/\btunicas?\b/, '').replace(/\b(de|color|su|y|en)\b/g, ' ').trim()
            tunic = extractColor(rest)
        }
        if (!hood && /\b(capillo|capillos|antifaz|capirote)\b/.test(clause)) {
            const rest = clause.replace(/\b(capillos?|antifaz|capirote|en|de|con|terciopelo|escudo|vivo)\b/g, ' ').trim()
            hood = extractColor(rest)
        }
        if (!cape && /\bcapa\b/.test(clause)) {
            const rest = clause.replace(/\b(capa|capas|recogida|sobre|el|la|hombro|izquierdo|con|en|franjas)\b/g, ' ').trim()
            cape = extractColor(rest)
        }
    }

    // 4. Patrón "Color BLANCA, capa NEGRA…" (sin palabra tunica)
    if (!tunic) {
        const colorStart = text.match(/^color\s+(\w+)/)
        if (colorStart) tunic = COLOR_MAP[colorStart[1]] ?? null
    }

    // 5. Fallback: primera palabra de color del texto
    if (!tunic) tunic = extractColor(text)

    if (!tunic) tunic = '#F2F2F2'
    if (!hood) hood = tunic
    if (!cape) cape = tunic

    return { tunic, hood, cape }
}
