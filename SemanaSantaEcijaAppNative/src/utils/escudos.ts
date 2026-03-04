// Mapeo de escudos locales para React Native
// En RN no podemos usar rutas dinámicas con require(), necesitamos un mapeo estático

export const escudosMap: Record<string, any> = {
  'amor-el-olivo.png': require('../../assets/images/escudos/amor-el-olivo.png'),
  'borriquita.png': require('../../assets/images/escudos/borriquita.png'),
  'cautivo-y-lagrimas.png': require('../../assets/images/escudos/cautivo-y-lagrimas.png'),
  'hermandad-de-confalon.png': require('../../assets/images/escudos/hermandad-de-confalon.png'),
  'expiracion.png': require('../../assets/images/escudos/expiracion.png'),
  'hermandad-de-la-sangre.png': require('../../assets/images/escudos/hermandad-de-la-sangre.png'),
  'mortaja.png': require('../../assets/images/escudos/mortaja.png'),
  'piedad.png': require('../../assets/images/escudos/piedad.png'),
  'resucitado.png': require('../../assets/images/escudos/resucitado.png'),
  'san-gil.png': require('../../assets/images/escudos/san-gil.png'),
  'san-juan.png': require('../../assets/images/escudos/san-juan.png'),
  'silencio.png': require('../../assets/images/escudos/silencio.png'),
  'sin-soga.png': require('../../assets/images/escudos/sin-soga.png'),
  'soledad.png': require('../../assets/images/escudos/soledad.png'),
  'yedra.png': require('../../assets/images/escudos/yedra.png'),
}

/**
 * Obtiene el source correcto para una imagen de escudo en React Native
 * @param shieldUrl - La URL del escudo en formato web (/assets/images/escudos/nombre.png)
 * @returns El source para <Image> de React Native o null si no existe
 */
export function getEscudoSource(shieldUrl: string | undefined): number | null {
  if (!shieldUrl) return null
  
  // Extraer el nombre del archivo de la ruta web
  const filename = shieldUrl.split('/').pop()
  if (!filename) return null
  
  return escudosMap[filename] || null
}
