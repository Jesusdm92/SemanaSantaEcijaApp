import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Platform,
    Linking,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@mobile/theme/colors'
import { getTwitterTimelineUrl } from '@mobile/config/socialConfig'

// Solo importamos WebView en plataformas nativas
const WebView = Platform.OS !== 'web'
    ? require('react-native-webview').WebView
    : null

// ─── Constantes ─────────────────────────────────────────────────────────────
const WEBVIEW_HEIGHT = 500
// Timeout general de seguridad (si nada pasa en absolut)
const LOADING_TIMEOUT_MS = 12000
// Tiempo para esperar señal del widget (8s para conexiones lentas)
const WIDGET_RESPONSE_TIMEOUT_MS = 8000

interface TwitterFeedProps {
    hermandadId: number
}

function extractUsername(url: string): string {
    return url.replace(/^https?:\/\/(www\.)?(twitter|x)\.com\//, '').replace(/\/$/, '')
}

function buildEmbedHtml(timelineUrl: string): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f9f7ff;display:flex;justify-content:center;padding:8px}
.twitter-timeline{width:100%!important}
</style>
</head>
<body>
<a class="twitter-timeline"
   href="${timelineUrl}"
   data-chrome="noheader nofooter noborders transparent"
   data-tweet-limit="5"
   data-theme="light"
   data-lang="es">Cargando tweets…</a>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>
</body>
</html>`
}

export default function TwitterFeed({ hermandadId }: TwitterFeedProps) {
    const timelineUrl = getTwitterTimelineUrl(hermandadId)

    if (!timelineUrl) return null

    const username = extractUsername(timelineUrl)
    const [isActivated, setIsActivated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // Refs para gestión de timeouts y eventos
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const widgetResponded = useRef(false)

    const clearTimer = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    const handleActivate = useCallback(() => {
        setIsActivated(true)
        setIsLoading(true)
        setHasError(false)
        widgetResponded.current = false
    }, [])

    const handleError = useCallback(() => {
        setIsLoading(false)
        setHasError(true)
        clearTimer()
    }, [clearTimer])

    const handleLoadFinished = useCallback(() => {
        if (Platform.OS !== 'web') {
            setIsLoading(false)
            clearTimer()
        }
        // En web esperamos al mensaje postMessage
    }, [clearTimer])

    const openInBrowser = useCallback(() => {
        const xUrl = `https://x.com/${username}`
        if (Platform.OS === 'web') {
            window.open(xUrl, '_blank')
        } else {
            Linking.openURL(xUrl)
        }
    }, [username])

    // Lógica de detección automática en Web vía postMessage
    useEffect(() => {
        if (Platform.OS === 'web' && isActivated && isLoading) {
            const handleMessage = (event: MessageEvent) => {
                // Twitter envía mensajes con data que incluye 'twttr' cuando el widget carga y se redimensiona
                if (event.data && (typeof event.data === 'string' && event.data.includes('twttr'))) {
                    widgetResponded.current = true
                    setIsLoading(false)
                    clearTimer()
                }
            }

            window.addEventListener('message', handleMessage)

            // Timeout de seguridad: Si el widget no "habla" en X segundos, asumimos que falló (texto plano de Rate Limit)
            timeoutRef.current = setTimeout(() => {
                if (!widgetResponded.current) {
                    setHasError(true) // Forzamos el fallback
                    setIsLoading(false)
                }
            }, WIDGET_RESPONSE_TIMEOUT_MS)

            return () => {
                window.removeEventListener('message', handleMessage)
                clearTimer()
            }
        }
    }, [isActivated, isLoading, clearTimer])

    const embedHtml = buildEmbedHtml(timelineUrl)

    // ── Render: Botón de activación ──
    if (!isActivated) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="logo-twitter" size={18} color={colors.secondary} />
                    <Text style={styles.headerTitle}>Noticias de X</Text>
                </View>
                <TouchableOpacity
                    style={styles.activateButton}
                    onPress={handleActivate}
                    activeOpacity={0.7}
                >
                    <View style={styles.activateIconWrapper}>
                        <Ionicons name="logo-twitter" size={28} color="#1DA1F2" />
                    </View>
                    <Text style={styles.activateText}>Cargar noticias de X</Text>
                    <Text style={styles.activateSubtext}>Pulsa para ver las últimas publicaciones</Text>
                </TouchableOpacity>
            </View>
        )
    }

    // ── Render: Fallback automático (Error o Rate Limit detectado) ──
    if (hasError) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons name="logo-twitter" size={18} color={colors.secondary} />
                    <Text style={styles.headerTitle}>Noticias de X</Text>
                </View>
                <View style={styles.fallbackContainer}>
                    <View style={styles.fallbackIconWrapper}>
                        <Ionicons name="logo-twitter" size={36} color="#1DA1F2" />
                    </View>
                    <Text style={styles.fallbackTitle}>@{username}</Text>
                    <Text style={styles.fallbackSubtext}>
                        No se pudo cargar el timeline.{'\n'}
                        Puedes ver las publicaciones directamente en su perfil.
                    </Text>
                    <TouchableOpacity
                        style={styles.openXButton}
                        onPress={openInBrowser}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="open-outline" size={16} color="#ffffff" />
                        <Text style={styles.openXButtonText}>Abrir en X</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.retryLink}
                        onPress={handleActivate}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="refresh-outline" size={14} color={colors.primary} />
                        <Text style={styles.retryLinkText}>Reintentar carga</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    // ── Render: WebView / Iframe ──
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="logo-twitter" size={18} color={colors.secondary} />
                <Text style={styles.headerTitle}>Noticias de X</Text>
            </View>
            <View style={styles.webViewContainer}>
                {isLoading && (
                    <View style={styles.loaderOverlay}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loaderText}>Cargando noticias…</Text>
                    </View>
                )}

                {Platform.OS === 'web' ? (
                    <iframe
                        src={`https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}?dnt=true&embedId=twitter-widget-0&frame=false&hideBorder=true&hideFooter=true&hideHeader=true&hideScrollBar=false&lang=es&maxHeight=${WEBVIEW_HEIGHT}px&theme=light&transparent=true`}
                        style={{
                            width: '100%',
                            height: WEBVIEW_HEIGHT,
                            border: 'none',
                            borderRadius: 10,
                            opacity: isLoading ? 0 : 1, // Ocultar mientras carga o si hay error visual
                        }}
                        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                        onLoad={handleLoadFinished}
                        onError={handleError}
                        title="Twitter Timeline"
                    />
                ) : WebView ? (
                    <WebView
                        source={{ html: embedHtml }}
                        style={[styles.webView, isLoading ? styles.webViewHidden : null]}
                        startInLoadingState
                        domStorageEnabled
                        javaScriptEnabled
                        androidLayerType="hardware"
                        onLoadEnd={handleLoadFinished}
                        onError={handleError}
                    />
                ) : null}
            </View>
        </View>
    )
}

// ─── Estilos ───
const styles = StyleSheet.create({
    container: {
        marginTop: 56,
        marginHorizontal: 16,
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.primary,
    },
    activateButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 28,
        backgroundColor: '#f0f8ff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#d4e9f7',
        borderStyle: 'dashed',
    },
    activateIconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#e8f4fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    activateText: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 4,
    },
    activateSubtext: {
        fontSize: 12,
        color: colors.muted,
    },
    webViewContainer: {
        height: WEBVIEW_HEIGHT,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: colors.background,
    },
    webView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    webViewHidden: {
        opacity: 0,
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        zIndex: 10,
    },
    loaderText: {
        marginTop: 12,
        fontSize: 13,
        color: colors.muted,
        fontWeight: '500',
    },
    fallbackContainer: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 16,
    },
    fallbackIconWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#e8f4fd',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    fallbackTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.textDark,
        marginBottom: 6,
    },
    fallbackSubtext: {
        fontSize: 13,
        color: colors.muted,
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 18,
    },
    openXButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#1DA1F2',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        elevation: 2,
    },
    openXButtonText: {
        color: '#ffffff',
        fontSize: 15,
        fontWeight: '700',
    },
    retryLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 14,
        paddingVertical: 6,
    },
    retryLinkText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
    },
})
