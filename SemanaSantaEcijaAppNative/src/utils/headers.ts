export const headersMap: Record<string, any> = {
    // Batch 1
    'amor_header': require('../../assets/images/CabeceraHermandades/OlivoCabecera.jpg'),
    'borriquita_header': require('../../assets/images/CabeceraHermandades/borriquita_header.jpg'),
    'cautivo_header': require('../../assets/images/CabeceraHermandades/cautivo_header.png'),
    'yedra_header': require('../../assets/images/CabeceraHermandades/yedra_header.jpg'),
    'expiracion_header': require('../../assets/images/CabeceraHermandades/expiracion.jpg'),

    // Batch 2
    'sangil_header': require('../../assets/images/CabeceraHermandades/sangil_header.jpg'),
    'confalon_header': require('../../assets/images/CabeceraHermandades/confalon_header.jpg'),
    'sangre_header': require('../../assets/images/CabeceraHermandades/lasangre_header.jpg'),
    'mortaja_header': require('../../assets/images/CabeceraHermandades/mortaja_header.jpg'),
    'piedad_header': require('../../assets/images/CabeceraHermandades/piedad_header.jpg'),

    // Batch 3
    'sanjuan_header': require('../../assets/images/CabeceraHermandades/sanjuan_header.jpg'),
    'silencio_header': require('../../assets/images/CabeceraHermandades/silencio_header.jpg'),
    'sinsoga_header': require('../../assets/images/CabeceraHermandades/sinsoga_header.jpg'),
    'soledad_header': require('../../assets/images/CabeceraHermandades/soledad_header.jpg'),
    'resucitado_header': require('../../assets/images/CabeceraHermandades/resureccion_header.jpg'),
}

export function getHeaderSource(headerKey: string | undefined): number | null {
    if (!headerKey) return null
    return headersMap[headerKey] || null
}
