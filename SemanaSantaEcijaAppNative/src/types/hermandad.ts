export interface Paso {
  nombre: string
  descripcion?: string
  descripcion_imagen?: string
  tunica_nazarenos?: string
  costaleros?: number
}

export interface Hermandad {
  id: number
  name: string
  day: string
  exitTime: string
  entryTime: string
  shieldUrl?: string
  mainImage?: string
  itinerary: string[]
  description: string
  colors?: string
  music?: string
  isFavorite?: boolean
  numeroPasos?: number
  pasosImages?: string[]
  // Nuevos campos 2025
  pasos?: Paso[]
  times?: {
    carreraOficial?: string
    entradaSantaCruz?: string
  }
  iglesia?: string
  lugarSalidaEntrada?: string
  fecha?: string
  tituloCompleto?: string
  anoFundacion?: string
  webOficial?: string
}
