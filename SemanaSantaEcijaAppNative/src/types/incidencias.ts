export type IncidenciaType = 'info' | 'warning' | 'danger'

export interface Incidencia {
    isActive: boolean
    type: IncidenciaType
    title: string
    message: string
    timestamp: string // ISO 8601
}

export interface StatusJSON {
    meta: {
        lastUpdated: string
        version: string
    }
    global?: {
        active: boolean
        message: string
        type: IncidenciaType
    }
    alerts: Record<string, Incidencia>
}
