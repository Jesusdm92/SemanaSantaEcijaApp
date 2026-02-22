import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Cruz de Guía Écija'
const BASE_URL = 'https://semanasantaecija.app' // Cambiar por tu URL real cuando esté publicada
const DEFAULT_IMAGE = `${BASE_URL}/assets/images/logo.png`
const DEFAULT_DESCRIPTION =
    'Guía oficial de la Semana Santa de Écija 2025. Consulta horarios, itinerarios, hermandades y toda la información de las procesiones.'

interface SeoHeadProps {
    title?: string
    description?: string
    image?: string
    url?: string
    type?: 'website' | 'article'
    /** JSON-LD structured data object */
    jsonLd?: Record<string, unknown>
}

export default function SeoHead({
    title,
    description = DEFAULT_DESCRIPTION,
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    jsonLd,
}: SeoHeadProps) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Semana Santa 2025`
    const canonicalUrl = url ? `${BASE_URL}${url}` : BASE_URL

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph (WhatsApp, Facebook, Telegram) */}
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content={SITE_NAME} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:locale" content="es_ES" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Structured Data */}
            {jsonLd && (
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
            )}
        </Helmet>
    )
}
