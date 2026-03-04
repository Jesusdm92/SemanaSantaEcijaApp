// Genera public/data/hermandades-2025.json y SemanaSantaEcijaAppNative/assets/data/hermandades-2025.json
// a partir de la web oficial y el PDF adjunto (si está disponible).
// Estrategia:
// 1) Intenta descargar/parsear la página turismoecija.com/semana-santa/ para extraer nombres y descripciones.
// 2) Intenta aprovechar el PDF SemanaSantaEcija2025.pdf para horarios/itinerarios (si está accesible).
// 3) Funde datos y escribe ambos JSON manteniendo el esquema de src/types/hermandad.ts.

import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { load as cheerioLoad } from 'cheerio'
import { createRequire } from 'module'
import { pipeline } from 'stream/promises'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
// Cargar directamente la implementación para evitar el bloque de test de index.js
const pdfParse = require('pdf-parse/lib/pdf-parse.js')

const SITE_URL = 'https://turismoecija.com/semana-santa/'
const PDF_URL = 'https://turismoecija.com/wp-content/uploads/2025/04/SemanaSantaEcija2025.pdf'

const DAYS_ORDER = [
  'Domingo de Ramos', 'Lunes Santo', 'Martes Santo', 'Miércoles Santo',
  'Jueves Santo', 'Viernes Santo', 'Sábado Santo', 'Domingo de Resurrección'
]

// Determinar el directorio raíz del proyecto (un nivel arriba de tools)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PROJECT_ROOT = path.resolve(__dirname, '..')
const OUTPUT_WEB = path.join(PROJECT_ROOT, 'public', 'data', 'hermandades-2025.json')
const OUTPUT_NATIVE = path.join(PROJECT_ROOT, 'SemanaSantaEcijaAppNative', 'assets', 'data', 'hermandades-2025.json')
const INPUT_CANON = path.join(PROJECT_ROOT, 'tools', 'data', 'itinerarios-2025.json')
const ESCUDOS_WEB = path.join(PROJECT_ROOT, 'public', 'assets', 'images', 'escudos')
const ESCUDOS_NATIVE = path.join(PROJECT_ROOT, 'SemanaSantaEcijaAppNative', 'assets', 'images', 'escudos')

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function baseRecord({ id, name, day }) {
  return {
    id,
    name,
    day,
    exitTime: '',
    entryTime: '',
    shieldUrl: '',
    mainImage: '',
    itinerary: [],
    description: '',
    colors: '',
    music: '',
    isFavorite: false,
  }
}

// Overrides deterministas (según guía 2025) para garantizar día/horas al menos básicas
const OVERRIDES = [
  { name: 'Borriquita', day: 'Domingo de Ramos', exitTime: '12:00', entryTime: '14:15' },
  { name: 'Amor (El Olivo)', day: 'Domingo de Ramos', exitTime: '15:45', entryTime: '23:15' },
  { name: 'Cautivo y Lágrimas', day: 'Domingo de Ramos', exitTime: '18:30', entryTime: '22:45' },
  { name: 'Yedra', day: 'Lunes Santo', exitTime: '19:00', entryTime: '23:00' },
  { name: 'Expiración', day: 'Lunes Santo', exitTime: '19:00', entryTime: '21:30' },
  { name: 'Sangre', day: 'Martes Santo' },
  { name: 'San Gil', day: 'Miércoles Santo', exitTime: '18:30', entryTime: '21:00' },
  { name: 'Silencio', day: 'Miércoles Santo', exitTime: '00:00', entryTime: '03:00' },
  { name: 'San Juan', day: 'Jueves Santo' },
  { name: 'Mortaja', day: 'Viernes Santo', exitTime: '19:15', entryTime: '23:05' },
  { name: 'Sin Soga', day: 'Viernes Santo', exitTime: '20:00', entryTime: '23:30' },
  { name: 'Confalón', day: 'Viernes Santo', exitTime: '19:15', entryTime: '23:10' },
  { name: 'Piedad', day: 'Sábado Santo', exitTime: '22:10', entryTime: '00:40' },
  { name: 'Soledad', day: 'Sábado Santo', exitTime: '18:15', entryTime: '23:00' },
  { name: 'Resucitado', day: 'Domingo de Resurrección', exitTime: '10:00', entryTime: '13:30' },
]

async function fetchHtml() {
  const { data } = await axios.get(SITE_URL, { timeout: 20000 })
  return cheerioLoad(data)
}

async function fetchPdfText() {
  try {
  const { data } = await axios.get(PDF_URL, { responseType: 'arraybuffer', timeout: 30000 })
  const { text } = await pdfParse(data)
    return text
  } catch (e) {
    console.warn('No se pudo descargar/parsear el PDF 2025:', e.message)
    return ''
  }
}

function extractFromHtml($) {
  // Heurística: encontrar bloques por hermandad y extraer nombre/día y pequeños textos.
  const items = []
  const seen = new Set()

  $('h4, h5, h6, h3').each((_, h) => {
    const title = $(h).text().trim()
    const t = title.replace(/\s+/g, ' ')
    // Detección de títulos tipo "PROCESIÓN DE ..." o nombres de hermandad
    const nameCandidate = t.replace(/^PROCESIÓN( DEL| DE LA| DE)?\s*/i, '').trim()
    if (nameCandidate.length < 3) return

    // Intentar inferir día a partir de encabezados superiores o contexto
    let day = null
    let cursor = $(h)
    for (let i = 0; i < 6 && cursor.length && !day; i++) {
      cursor = cursor.prevAll('h2,h3,h4').first()
      const txt = (cursor.text() || '').trim()
      for (const d of DAYS_ORDER) if (txt.toLowerCase().includes(d.toLowerCase())) day = d
    }

    // Si no encontramos día, saltamos
    if (!day) return

    const key = `${day}|${nameCandidate}`
    if (seen.has(key)) return
    seen.add(key)

    // Descripción breve: recoger algunos párrafos siguientes
    const desc = []
    let sib = $(h).next()
    let guard = 0
    while (sib.length && guard < 6) {
      const tag = (sib.prop('tagName') || '').toLowerCase()
      if (/^h[1-6]$/.test(tag)) break
      const text = sib.text().trim()
      if (text && text.length > 40) desc.push(text)
      sib = sib.next()
      guard++
    }

    items.push({ name: nameCandidate, day, description: desc.join(' ') })
  })

  return items
}

function extractFromPdf(text) {
  // Heurística: líneas con estructura de tabla (NOMBRE, horarios, recorrido)
  // Extraeremos horarios básicos si detectamos horas (hh:mm).
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
  const hourRe = /\b(\d{1,2}[:\.](\d{2}))\b/g
  const out = []

  for (let i = 0; i < lines.length; i++) {
    const l = lines[i]
    // Detectar un posible nombre de hermandad
    if (/^(BORRIQUITA|AMOR|CAUTIVO|YEDRA|EXPIRACIÓN|SAN GIL|CONFALÓN|SANGRE|SILENCIO|SAN JUAN|MORTAJA|SIN SOGA|PIEDAD|SOLEDAD|RESUCITADO)/i.test(l)) {
      const name = l
      // buscar horas en la línea y algunas siguientes
      let exitTime = ''
      let entryTime = ''
      for (let j = i; j < Math.min(i + 5, lines.length); j++) {
        const m = [...lines[j].matchAll(hourRe)].map(x => x[1].replace('.', ':'))
        if (m.length >= 1 && !exitTime) exitTime = m[0]
        if (m.length >= 2) entryTime = m[m.length - 1]
      }
      out.push({ name, exitTime, entryTime })
    }
  }
  return out
}

function fuse(htmlItems, pdfItems) {
  // Consolidar por nombre semejante y asignar ID y día
  const result = []
  const index = new Map()

  function normalizeName(n) {
    return slugify(n).replace(/-(hermandad|cofradia|procesion|de|del|la|el|y)-/g, '-')
  }

  for (const it of htmlItems) {
    const key = `${it.day}|${normalizeName(it.name)}`
    if (!index.has(key)) {
      const id = Math.abs(hashCode(key)) % 100000 + 100
      index.set(key, baseRecord({ id, name: it.name, day: it.day }))
      index.get(key).description = it.description
    }
  }

  for (const it of pdfItems) {
    // Distribuir por heurística de día según nombre (muy básico)
    let day = null
    const name = it.name
    const mapping = [
      ['BORRIQUITA', 'Domingo de Ramos'],
      ['AMOR', 'Domingo de Ramos'],
      ['CAUTIVO', 'Domingo de Ramos'],
      ['YEDRA', 'Lunes Santo'],
      ['EXPIRACIÓN', 'Lunes Santo'],
      ['SAN GIL', 'Miércoles Santo'],
      ['SANGRE', 'Martes Santo'],
      ['SILENCIO', 'Miércoles Santo'],
      ['SAN JUAN', 'Jueves Santo'],
      ['MORTAJA', 'Viernes Santo'],
      ['SIN SOGA', 'Viernes Santo'],
      ['PIEDAD', 'Sábado Santo'],
      ['SOLEDAD', 'Sábado Santo'],
      ['RESUCITADO', 'Domingo de Resurrección']
    ]
    for (const [needle, d] of mapping) if (name.toUpperCase().includes(needle)) day = d
    if (!day) continue

    const key = `${day}|${normalizeName(name)}`
    if (!index.has(key)) {
      const id = Math.abs(hashCode(key)) % 100000 + 100
      index.set(key, baseRecord({ id, name, day }))
    }
    const rec = index.get(key)
    if (it.exitTime && !rec.exitTime) rec.exitTime = it.exitTime
    if (it.entryTime && !rec.entryTime) rec.entryTime = it.entryTime
  }

  // Asegurar que todos los días aparecen en la salida final con al menos los ya recogidos.
  // Aplicar overrides deterministas (crear si no existe, completar horas si faltan)
  for (const ov of OVERRIDES) {
    const key = `${ov.day}|${normalizeName(ov.name)}`
    if (!index.has(key)) {
      const id = Math.abs(hashCode(key)) % 100000 + 100
      index.set(key, baseRecord({ id, name: ov.name, day: ov.day }))
    }
    const rec = index.get(key)
    if (ov.exitTime && !rec.exitTime) rec.exitTime = ov.exitTime
    if (ov.entryTime && !rec.entryTime) rec.entryTime = ov.entryTime
  }

  const items = [...index.values()]
  items.sort((a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day) || a.name.localeCompare(b.name, 'es'))
  return items
}

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return hash
}

function parseCanon() {
  try {
    const raw = JSON.parse(fs.readFileSync(INPUT_CANON, 'utf8'))
    return raw.procesiones || []
  } catch (e) {
    console.warn('No se pudo leer el JSON canónico:', e.message)
    return []
  }
}

async function downloadEscudo(escudoURL, hermandadName) {
  if (!escudoURL) return ''
  try {
    // Crear nombre de archivo limpio desde el nombre de la hermandad
    const filename = `${slugify(hermandadName)}.png`
    const webPath = path.join(ESCUDOS_WEB, filename)
    const nativePath = path.join(ESCUDOS_NATIVE, filename)
    
    // Crear directorios si no existen
    fs.mkdirSync(ESCUDOS_WEB, { recursive: true })
    fs.mkdirSync(ESCUDOS_NATIVE, { recursive: true })
    
    // Descargar solo si no existe ya
    if (!fs.existsSync(webPath)) {
      console.log(`  > Descargando escudo: ${filename}`)
      const response = await axios({
        method: 'GET',
        url: escudoURL,
        responseType: 'stream',
        timeout: 15000
      })
      
      // Guardar en web
      await pipeline(response.data, fs.createWriteStream(webPath))
      
      // Copiar a native
      fs.copyFileSync(webPath, nativePath)
    }
    
    // Retornar ruta relativa para web (native usará require local)
    return `/assets/images/escudos/${filename}`
  } catch (e) {
    console.warn(`  ! Error descargando escudo de ${hermandadName}:`, e.message)
    return ''
  }
}

async function mapCanonToHermandades(procs) {
  const items = []
  for (const p of procs) {
    const name = canonicalName(p.hermandad)
    const day = p.dia
    const id = Math.abs(hashCode(`${day}|${name}`)) % 100000 + 100
    const exitTime = cleanHour(p.horarios?.salida)
    const entryTime = cleanHour(p.horarios?.entrada_templo)
    const itinerary = splitItinerary(p.itinerario)
    const description = buildDescription(p)
    const colors = ''
    const music = 'Sin especificar'
    const pasos = Array.isArray(p.pasos) ? p.pasos : []
    const numeroPasos = pasos.length || undefined
    const pasosImages = []
    
    // Descargar escudo si está disponible
    const shieldUrl = await downloadEscudo(p.escudoURL, name)
    
    items.push({
      id, name, day,
      exitTime: exitTime || '',
      entryTime: entryTime || '',
      shieldUrl: shieldUrl || '',
      mainImage: '',
      itinerary,
      description,
      colors,
      music,
      isFavorite: false,
      numeroPasos,
      pasos,
      pasosImages,
      times: {
        carreraOficial: cleanHour(p.horarios?.carrera_oficial),
        entradaSantaCruz: cleanHour(p.horarios?.entrada_santa_cruz)
      },
      iglesia: p.iglesia || undefined,
      lugarSalidaEntrada: p.lugar_salida_entrada || undefined,
      fecha: p.fecha || undefined,
      tituloCompleto: p.titulo_completo || undefined,
      anoFundacion: p.ano_fundacion || undefined,
      webOficial: p.web_oficial || undefined
    })
  }
  items.sort((a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day) || a.name.localeCompare(b.name, 'es'))
  return items
}

function canonicalName(h) {
  // Reducir nombres largos a denominaciones usadas en la app
  const H = h.toLowerCase()
  if (H.includes('entrada triunfal')) return 'Borriquita'
  if (H.includes('sacramental del amor') || H.includes('amor')) return 'Amor (El Olivo)'
  if (H.includes('cautivo')) return 'Cautivo y Lágrimas'
  if (H.includes('yedra')) return 'Yedra'
  if (H.includes('expiración')) return 'Expiración'
  if (H.includes('san gil')) return 'San Gil'
  if (H.includes('silencio')) return 'Silencio'
  if (H.includes('san juan')) return 'San Juan'
  if (H.includes('mortaja')) return 'Mortaja'
  if (H.includes('sin soga')) return 'Sin Soga'
  if (H.includes('piedad')) return 'Piedad'
  if (H.includes('soledad')) return 'Soledad'
  if (H.includes('resucitado')) return 'Resucitado'
  return h
}

function cleanHour(h) {
  if (!h || typeof h !== 'string') return ''
  const m = h.match(/(\d{1,2})[:\.](\d{2})/)
  if (m) return `${m[1].padStart(2, '0')}:${m[2]}`
  const m2 = h.match(/(\d{1,2})/)
  if (m2) return `${m2[1].padStart(2, '0')}:00`
  return ''
}

function splitItinerary(s) {
  if (!s) return []
  return s.split(',').map(x => x.trim()).filter(Boolean)
}

function buildDescription(p) {
  const parts = []
  if (p.titulo_completo) parts.push(p.titulo_completo)
  if (p.ano_fundacion) parts.push(`Fundación: ${p.ano_fundacion}.`)
  if (p.iglesia) parts.push(`Sede canónica: ${p.iglesia}.`)
  if (p.lugar_salida_entrada) parts.push(`Salida/entrada: ${p.lugar_salida_entrada}.`)
  if (p.fecha) parts.push(`Fecha: ${p.fecha}.`)
  return parts.join(' ')
}

async function main() {
  // Preferir la fuente canónica proporcionada por el usuario
  const canon = parseCanon()
  let fused = []
  if (canon.length > 0) {
    console.log('> Usando fuente canónica (itinerarios-2025.json)…')
    fused = await mapCanonToHermandades(canon)
  } else {
    console.log('> Extrayendo HTML oficial…')
    const $ = await fetchHtml()
    const htmlItems = extractFromHtml($)

    console.log('> Extrayendo PDF 2025…')
    const pdfText = await fetchPdfText()
    const pdfItems = pdfText ? extractFromPdf(pdfText) : []

    console.log('> Fusionando…')
    fused = fuse(htmlItems, pdfItems)
  }

  // Si la extracción no devuelve nada, no sobrescribimos: mantenemos los JSON existentes
  if (fused.length === 0) {
    console.warn('No se pudo construir el dataset automáticamente. Mantengo los JSON existentes si los hay.')
    if (fs.existsSync(OUTPUT_WEB)) console.log('• Conservado', OUTPUT_WEB)
    if (fs.existsSync(OUTPUT_NATIVE)) console.log('• Conservado', OUTPUT_NATIVE)
    return
  }

  // Si existen placeholders previos, fusionar por id manteniendo campos no vacíos
  function readIfExists(p) {
    try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return [] }
  }
  function mergeRecords(oldArr, newArr) {
    const byId = new Map(oldArr.map(o => [o.id, o]))
    return newArr.map(n => {
      const o = byId.get(n.id)
      if (!o) return n
      return {
        ...n,
        exitTime: n.exitTime || o.exitTime || '',
        entryTime: n.entryTime || o.entryTime || '',
        shieldUrl: n.shieldUrl || o.shieldUrl || '',
        mainImage: n.mainImage || o.mainImage || '',
        itinerary: n.itinerary?.length ? n.itinerary : (o.itinerary || []),
        description: n.description || o.description || '',
        colors: n.colors || o.colors || '',
        music: n.music || o.music || '',
        isFavorite: !!(o.isFavorite || n.isFavorite)
      }
    })
  }

  const prevWeb = readIfExists(OUTPUT_WEB)
  const prevNative = readIfExists(OUTPUT_NATIVE)
  const outWeb = mergeRecords(prevWeb, fused)
  const outNative = mergeRecords(prevNative, fused)

  fs.mkdirSync(path.dirname(OUTPUT_WEB), { recursive: true })
  fs.writeFileSync(OUTPUT_WEB, JSON.stringify(outWeb, null, 2), 'utf8')
  console.log('✓ Escrito', OUTPUT_WEB, `(${outWeb.length} entradas)`) 

  fs.mkdirSync(path.dirname(OUTPUT_NATIVE), { recursive: true })
  fs.writeFileSync(OUTPUT_NATIVE, JSON.stringify(outNative, null, 2), 'utf8')
  console.log('✓ Escrito', OUTPUT_NATIVE, `(${outNative.length} entradas)`) 
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
