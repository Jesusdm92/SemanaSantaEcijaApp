export interface Hermandad {
  id: number;
  name: string;
  day: string;
  exitTime: string;
  entryTime: string;
  shieldUrl: string;
  mainImage: string;
  itinerary: string[];
  description: string;
  colors: string;
  music: string;
  isFavorite: boolean;
  numeroPasos?: number;
  pasosImages?: string[];
  pasos?: Array<{
    nombre: string;
    descripcion?: string;
    descripcion_imagen?: string;
    tunica_nazarenos?: string;
    costaleros?: number | string;
  }>;
  times?: {
    carreraOficial?: string;
    entradaSantaCruz?: string;
  };
  iglesia?: string;
  lugarSalidaEntrada?: string;
  fecha?: string;
  tituloCompleto?: string;
  anoFundacion?: string;
  webOficial?: string;
}
