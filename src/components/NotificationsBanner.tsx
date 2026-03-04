import { useEffect, useState } from 'react'

const STATUS_URL = 'https://gist.githubusercontent.com/Jesusdm92/68ec076a0229259df23eb5f073ec8c31/raw/status.json'

interface AlertData {
    isActive: boolean
    type: 'warning' | 'danger' | 'info'
    title: string
    message: string
    timestamp: string
}

interface StatusData {
    meta: {
        lastUpdated: string
    }
    global: {
        active: boolean
        message: string
        type: 'warning' | 'danger' | 'info'
    }
    alerts: Record<string, AlertData>
}

// Mapa de IDs a nombres legibles (opcional, si queremos mostrar el nombre de la hermandad)
const hermandadNames: Record<string, string> = {
    '75910': 'El Amor',
    '26978': 'La Borriquita',
    '57188': 'El Cautivo',
    '68445': 'La Yedra',
    '1277': 'Santiago',
    '78066': 'San Gil',
    '27120': 'Confalón',
    '64425': 'La Sangre',
    '88787': 'La Sagrada Mortaja',
    '83972': 'La Piedad',
    '47463': 'El Silencio',
    '34963': 'San Juan',
    '77415': 'Sin Soga',
    '43437': 'La Soledad',
    '9329': 'El Resucitado'
}

export default function NotificationsBanner() {
    const [data, setData] = useState<StatusData | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Añadimos timestamp para evitar caché agresiva de GitHub Raw
                const res = await fetch(`${STATUS_URL}?t=${Date.now()}`)
                if (res.ok) {
                    const json = await res.json()
                    setData(json)
                }
            } catch (e) {
                console.error('Error fetching alerts:', e)
            }
        }

        fetchData()
        // Sondeo cada 30 segundos
        const interval = setInterval(fetchData, 30000)
        return () => clearInterval(interval)
    }, [])

    if (!data) return null

    const activeGlobal = data.global && data.global.active
    const activeAlerts = Object.entries(data.alerts || {}).filter(([_, alert]) => alert.isActive)

    if (!activeGlobal && activeAlerts.length === 0) return null

    return (
        <div className="w-100">
            {/* Aviso Global */}
            {activeGlobal && (
                <div className={`alert alert-${mapTypeToBootstrap(data.global.type)} mb-0 rounded-0 text-center fw-bold border-0 shadow-sm`} role="alert">
                    <i className={`bi bi-${mapIcon(data.global.type)} me-2`}></i>
                    {data.global.message}
                </div>
            )}

            {/* Avisos por Hermandad */}
            {activeAlerts.map(([id, alert]) => (
                <div key={id} className={`alert alert-${mapTypeToBootstrap(alert.type)} mb-0 rounded-0 text-center border-0 border-top shadow-sm`} role="alert">
                    <div className="container">
                        <strong>{hermandadNames[id] || 'Hermandad'}:</strong> {alert.message}
                    </div>
                </div>
            ))}
        </div>
    )
}

function mapTypeToBootstrap(type: string) {
    switch (type) {
        case 'danger': return 'danger'
        case 'warning': return 'warning'
        case 'info': return 'primary' // Info en bootstrap es azul claro, primary es azul fuerte. Info suele ser más estándar.
        default: return 'warning'
    }
}

function mapIcon(type: string) {
    switch (type) {
        case 'danger': return 'exclamation-octagon-fill'
        case 'warning': return 'exclamation-triangle-fill'
        case 'info': return 'info-circle-fill'
        default: return 'bell-fill'
    }
}
