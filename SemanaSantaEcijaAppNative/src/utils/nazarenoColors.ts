/**
 * Analiza el texto de descripción del hábito nazareno
 * y extrae los colores de túnica, capillo y capa.
 *
 * Fuente: campo `tunica_nazarenos` de cada paso en hermandades.json
 *
 * Ejemplos reales:
 *  "Color blanca, capa negra y capillo en terciopelo negro con vivo blanco"
 *  "Túnica y capillo verde. Capa blanca…"
 *  "Morada con botonadura blanca…Capa blanca…capillo morado con escudo."
 *  "Negra con capa recogida en el fajín, capillo negro"
 *  "Túnica color crema, capillo blanco, capa blanca con franjas rojas"
 */

export interface NazarenoColors {
  tunic: string
  hood: string
  cape: string
}

// Mapa de palabras de color → hex
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

/** Quita tildes para facilitar el matching */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Busca la primera palabra de color en una cadena de texto */
function extractColor(segment: string): string | null {
  const words = segment.split(/[\s,;.]+/)
  for (const w of words) {
    const c = COLOR_MAP[w]
    if (c) return c
  }
  return null
}

/**
 * Analiza el texto con reglas progresivas:
 * 1. Patrones combinados explícitos (todos iguales)
 * 2. Secciones individuales por palabra clave (tunica, capa, capillo)
 * 3. Primera palabra del texto como color de túnica (fallback)
 */
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

  // ── 1. Patrón: "tunica, capa y capillo COLOR" ─────────────────
  const allSame = text.match(/tunica,\s*capa\s*y\s*capillo\s+(\w+)/)
  if (allSame) {
    const c = COLOR_MAP[allSame[1]]
    if (c) return { tunic: c, hood: c, cape: c }
  }

  // ── 2. Patrón: "tunica y capillo COLOR" ───────────────────────
  const tunicHood = text.match(/tunica\s+y\s+capillo\s+(?:de\s+(?:color\s+)?)?(\w+)/)
  if (tunicHood) {
    const c = COLOR_MAP[tunicHood[1]]
    if (c) { tunic = c; hood = c }
  }

  // ── 3. Extraer cada sección por separado ──────────────────────
  // Dividimos el texto en claúsulas usando comas y puntos como delimitadores
  // luego buscamos la palabra clave en cada cláusula

  const clauses = text.split(/[,;.]/).map(c => c.trim()).filter(Boolean)

  for (const clause of clauses) {
    // Túnica
    if (!tunic && /\b(tunica|tunicas)\b/.test(clause)) {
      // Quitar "tunica" para buscar el color del resto
      const rest = clause.replace(/\btunicas?\b/, '').trim()
      // Ignorar "color" como palabra de enlace
      const cleaned = rest.replace(/\b(de|color|su|y|en)\b/g, ' ').trim()
      tunic = extractColor(cleaned)
    }
    // Capillo / antifaz / capirote
    if (!hood && /\b(capillo|capillos|antifaz|capirote)\b/.test(clause)) {
      const rest = clause
        .replace(/\b(capillos?|antifaz|capirote|en|de|con|terciopelo|escudo|vivo)\b/g, ' ')
        .trim()
      hood = extractColor(rest)
    }
    // Capa
    if (!cape && /\bcapa\b/.test(clause)) {
      const rest = clause
        .replace(/\b(capa|capas|recogida|sobre|el|la|hombro|izquierdo|con|en|franjas)\b/g, ' ')
        .trim()
      cape = extractColor(rest)
    }
  }

  // ── 4. Patrón adicional: "color BLANCA, capa NEGRA…" ──────────
  // Algunas entradas omiten la palabra "tunica" y empiezan por "Color blanca…"
  if (!tunic) {
    const colorStart = text.match(/^color\s+(\w+)/)
    if (colorStart) tunic = COLOR_MAP[colorStart[1]] ?? null
  }

  // ── 5. Fallback: primera palabra de color del texto completo ──
  if (!tunic) tunic = extractColor(text)

  // ── 6. Defaults cuando no se encontró nada ────────────────────
  if (!tunic) tunic = '#F2F2F2'
  if (!hood) hood = tunic         // si no hay capillo, igual que túnica
  if (!cape) cape = tunic         // si no hay capa, igual que túnica

  return { tunic, hood, cape }
}
