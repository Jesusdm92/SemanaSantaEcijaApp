/**
 * socialConfig.ts
 *
 * Mapea cada hermandad (por su ID numérico) al nombre de usuario de X (Twitter).
 * ─────────────────────────────────────────────────────────────────────────────
 * Para configurar una hermandad, reemplaza '' por el @usuario de X SIN la @.
 * Ejemplo:  75910: 'HdadDelOlivo',
 *
 * Si el valor está vacío (''), la sección de noticias de X NO se mostrará
 * en la pantalla de detalle de esa hermandad.
 */

export const twitterHandles: Record<number, string> = {
    75910: 'amoryconcepcion', // Amor (El Olivo)
    26978: '', // Borriquita
    57188: '', // Cautivo y Lágrimas
    68445: '', // Yedra
    1277: '', // Expiración
    78066: '', // San Gil
    27120: '', // Hermandad de Confalón
    64425: '', // Hermandad de la Sangre
    88787: '', // Mortaja
    83972: '', // Piedad
    47463: '', // San Juan
    34963: '', // Silencio
    77415: '', // Sin Soga
    43437: '', // Soledad
    9329: '', // Resucitado
}

/**
 * Devuelve la URL completa del timeline embebido de X para una hermandad.
 * Retorna null si no hay handle configurado.
 */
export function getTwitterTimelineUrl(hermandadId: number): string | null {
    const handle = twitterHandles[hermandadId]
    if (!handle) return null
    return `https://twitter.com/${handle}`
}
