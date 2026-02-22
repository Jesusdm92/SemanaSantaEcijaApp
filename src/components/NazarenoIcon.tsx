import React from 'react'

interface NazarenoIconProps {
    tunicColor?: string
    hoodColor?: string
    capeColor?: string
    /** Altura total del icono en px */
    size?: number
}

/**
 * Silueta de nazareno construida 100% con divs y CSS inline.
 * Refleja fielmente la imagen de referencia:
 *  △   capirote   → hoodColor
 * [👁👁] antifaz  → hoodColor
 * ████  capa      → capeColor  (más ancha que la túnica)
 *  ██   túnica    → tunicColor (más estrecha, acampanada)
 *   🕯  vela
 */
export default function NazarenoIcon({
    tunicColor = '#F2F2F2',
    hoodColor = '#5C2D91',
    capeColor = '#F2F2F2',
    size = 80,
}: NazarenoIconProps) {
    const s = size / 80  // factor de escala

    const px = (v: number) => `${Math.round(v * s)}px`

    // Dimensiones clave
    const capHalfW = Math.round(14 * s)   // semiancho base capirote
    const capH = Math.round(32 * s)   // altura capirote
    const faceW = Math.round(20 * s)
    const faceH = Math.round(10 * s)
    const eyeW = Math.round(3.5 * s)
    const eyeH = Math.round(2.5 * s)
    const capeW = Math.round(38 * s)
    const capeH = Math.round(18 * s)
    const tunicTopW = Math.round(20 * s)
    const tunicBotW = Math.round(26 * s)
    const tunicH = Math.round(32 * s)
    const totalW = capeW + Math.round(10 * s)

    const isLight = (hex: string) => {
        const n = parseInt(hex.replace('#', ''), 16)
        return ((n >> 16 & 255) + (n >> 8 & 255) + (n & 255)) / 765 > 0.82
    }

    const bTunic = isLight(tunicColor) ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.06)'
    const bCape = isLight(capeColor) ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.06)'
    const bHood = isLight(hoodColor) ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.06)'

    const scaleX = tunicBotW / tunicTopW

    return (
        <div style={{ width: totalW, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

            {/* ① Capirote (triángulo CSS) */}
            <div style={{
                width: 0, height: 0,
                borderLeft: `${capHalfW}px solid transparent`,
                borderRight: `${capHalfW}px solid transparent`,
                borderBottom: `${capH}px solid ${hoodColor}`,
                filter: isLight(hoodColor) ? `drop-shadow(0 0 1px ${bHood})` : undefined,
                zIndex: 3,
                flexShrink: 0,
            }} />

            {/* ② Antifaz */}
            <div style={{
                width: faceW, height: faceH,
                backgroundColor: hoodColor,
                borderRadius: Math.round(4 * s),
                marginTop: -1,
                zIndex: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: Math.round(4 * s),
                border: `0.5px solid ${bHood}`,
                flexShrink: 0,
            }}>
                <div style={{ width: eyeW, height: eyeH, borderRadius: '50%', backgroundColor: '#111' }} />
                <div style={{ width: eyeW, height: eyeH, borderRadius: '50%', backgroundColor: '#111' }} />
            </div>

            {/* ③ Capa (más ancha que la túnica → hombros visibles) */}
            <div style={{
                width: capeW, height: capeH,
                backgroundColor: capeColor,
                borderRadius: `${Math.round(10 * s)}px ${Math.round(10 * s)}px ${Math.round(4 * s)}px ${Math.round(4 * s)}px`,
                marginTop: -1,
                zIndex: 2,
                border: `0.8px solid ${bCape}`,
                flexShrink: 0,
            }} />

            {/* ④ Túnica (acampanada con scaleX) */}
            <div style={{
                width: tunicTopW, height: tunicH,
                backgroundColor: tunicColor,
                marginTop: -Math.round(4 * s),
                borderRadius: `0 0 ${Math.round(3 * s)}px ${Math.round(3 * s)}px`,
                zIndex: 3,
                border: `0.8px solid ${bTunic}`,
                flexShrink: 0,
                transform: `scaleX(${scaleX})`,
            }} />

            {/* ⑤ Vela */}
            <div style={{
                position: 'absolute',
                top: capH + faceH + capeH + Math.round(6 * s),
                right: Math.round(2 * s),
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                zIndex: 5,
            }}>
                {/* Llama */}
                <div style={{
                    width: px(5), height: px(6),
                    backgroundColor: '#FFA726',
                    borderRadius: `50% 50% 50% 50% / 60% 60% 40% 40%`,
                    marginBottom: 1,
                }} />
                {/* Vela */}
                <div style={{
                    width: px(4), height: px(10),
                    backgroundColor: '#FFF9C4',
                    borderRadius: 2,
                    border: '0.5px solid rgba(0,0,0,0.15)',
                }} />
            </div>

        </div>
    )
}
