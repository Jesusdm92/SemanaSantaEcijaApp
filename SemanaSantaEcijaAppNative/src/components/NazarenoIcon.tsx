import React from 'react'
import { View } from 'react-native'

interface NazarenoIconProps {
    tunicColor?: string
    hoodColor?: string
    capeColor?: string
    /** Total height of the icon in pixels */
    size?: number
}

/**
 * Silueta de nazareno fiel a la imagen de referencia.
 *
 * Anatomía (de arriba a abajo):
 *   △   capirote     → hoodColor
 *  [👁👁] antifaz   → hoodColor
 *  ████  capa ancha  → capeColor  (visible en los hombros, más ancha que la túnica)
 *   ██   túnica      → tunicColor (más estrecha, sobresale por delante de la capa)
 *    🕯   vela
 */
export default function NazarenoIcon({
    tunicColor = '#F5F5F5',
    hoodColor = '#5C2D91',
    capeColor = '#F5F5F5',
    size = 80,
}: NazarenoIconProps) {
    // ── Escala base: diseño para size = 80 ──────────────────────────
    const s = size / 80

    const scale = (v: number) => Math.round(v * s)

    // Capirote
    const capHalfW = scale(14)   // semiancho de la base del triángulo
    const capH = scale(32)   // altura del capirote

    // Antifaz
    const faceW = scale(20)
    const faceH = scale(10)
    const eyeW = scale(3.5)
    const eyeH = scale(2.5)

    // Capa (hombros) — considerablemente más ancha que la túnica
    const capeW = scale(38)
    const capeH = scale(18)
    const capeRadT = scale(10)  // radio superior (hombros redondeados)
    const capeRadB = scale(4)

    // Túnica — más estrecha, centrada
    const tunicTopW = scale(20)
    const tunicBotW = scale(26)   // base ligeramente acampanada
    const tunicH = scale(32)

    // Vela
    const candleW = scale(4)
    const candleH = scale(10)
    const flameW = scale(5)
    const flameH = scale(6)

    // Total width del contenedor (capa marca el ancho + espacio vela)
    const totalW = capeW + scale(10)

    // ── Detección de colores claros (borde visible sobre fondo blanco) ──
    const isLight = (hex: string) => {
        const n = parseInt(hex.replace('#', ''), 16)
        const r = (n >> 16) & 255
        const g = (n >> 8) & 255
        const b = n & 255
        return (r + g + b) / 765 > 0.82   // umbral ≈ 82% de blancura
    }

    const borderTunic = isLight(tunicColor) ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.06)'
    const borderCape = isLight(capeColor) ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.06)'
    const borderHood = isLight(hoodColor) ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.06)'
    const sameCapeAsTunic = capeColor === tunicColor

    return (
        <View style={{ width: totalW, height: size, alignItems: 'center' }}>

            {/* ① CAPIROTE ─────────────────────────────────────────────── */}
            <View
                style={{
                    width: 0, height: 0,
                    borderLeftWidth: capHalfW,
                    borderRightWidth: capHalfW,
                    borderBottomWidth: capH,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderBottomColor: hoodColor,
                    zIndex: 3,
                }}
            />

            {/* ② ANTIFAZ ──────────────────────────────────────────────── */}
            <View
                style={{
                    width: faceW, height: faceH,
                    backgroundColor: hoodColor,
                    borderRadius: scale(4),
                    marginTop: -1,
                    zIndex: 3,
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: scale(4),
                    flexDirection: 'row',
                    borderWidth: 0.5,
                    borderColor: borderHood,
                }}
            >
                <View style={{ width: eyeW, height: eyeH, borderRadius: eyeW / 2, backgroundColor: '#111' }} />
                <View style={{ width: eyeW, height: eyeH, borderRadius: eyeW / 2, backgroundColor: '#111' }} />
            </View>

            {/* ③ CAPA ─────────────────────────────────────────────────── */}
            {/*   Más ancha que la túnica → visible en los laterales (hombros) */}
            <View
                style={{
                    width: capeW,
                    height: capeH,
                    backgroundColor: capeColor,
                    borderTopLeftRadius: capeRadT,
                    borderTopRightRadius: capeRadT,
                    borderBottomLeftRadius: capeRadB,
                    borderBottomRightRadius: capeRadB,
                    marginTop: -1,
                    zIndex: 2,
                    borderWidth: 0.8,
                    borderColor: borderCape,
                    // Si la capa es del mismo color que la túnica, separar con una línea en el borde
                    ...(sameCapeAsTunic ? {} : {}),
                }}
            />

            {/* ③b Línea divisoria entre capa y túnica cuando son iguales ── */}
            {sameCapeAsTunic && (
                <View
                    style={{
                        position: 'absolute',
                        top: capH + faceH + capeH - scale(2),
                        width: capeW * 0.7,
                        height: scale(1),
                        backgroundColor: 'rgba(0,0,0,0.12)',
                        zIndex: 4,
                    }}
                />
            )}

            {/* ④ TÚNICA ───────────────────────────────────────────────── */}
            {/*   Superpuesta sobre la capa; más estrecha → la capa asoma por los lados */}
            <View
                style={{
                    width: tunicTopW,
                    height: tunicH,
                    backgroundColor: tunicColor,
                    marginTop: -scale(4),          // solapa ligeramente con la capa
                    borderBottomLeftRadius: scale(tunicBotW * 0.14),
                    borderBottomRightRadius: scale(tunicBotW * 0.14),
                    zIndex: 3,
                    borderWidth: 0.8,
                    borderColor: borderTunic,
                    // Efecto acampanado (mayor ancho abajo)
                    transform: [{ scaleX: tunicBotW / tunicTopW }],
                }}
            />

            {/* ⑤ VELA (lado derecho, a la altura de las manos) ─────────── */}
            <View
                style={{
                    position: 'absolute',
                    top: capH + faceH + capeH + scale(6),
                    right: scale(2),
                    alignItems: 'center',
                    zIndex: 5,
                }}
            >
                {/* Llama */}
                <View style={{
                    width: flameW, height: flameH,
                    backgroundColor: '#FFA726',
                    borderRadius: flameW / 2,
                    borderTopLeftRadius: flameW,
                    borderTopRightRadius: flameW,
                    marginBottom: 1,
                }} />
                {/* Cuerpo de la vela */}
                <View style={{
                    width: candleW, height: candleH,
                    backgroundColor: '#FFF9C4',
                    borderRadius: 2,
                    borderWidth: 0.5,
                    borderColor: 'rgba(0,0,0,0.15)',
                }} />
            </View>

        </View>
    )
}
