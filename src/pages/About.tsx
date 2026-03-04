import React from 'react'
import SeoHead from '@/components/SeoHead'

interface LinkItem { label: string; url: string; icon: string }

const puntosInteres = [
  'Plaza de España "El Salón": Carrera Oficial y ambiente central.',
  'Parroquia de Santiago: historia y salida de cortejos significativos.',
  'Parroquia de Santa Cruz: recogimiento y sobriedad.',
  'Parroquia de San Gil: tradición y devoción popular.',
  'Iglesia de la Victoria: referencia destacada del Viernes Santo.'
]

const consejos = [
  { text: 'Llega con antelación a los puntos más concurridos.', icon: 'clock' },
  { text: 'Respeta el cortejo y sigue indicaciones de la organización.', icon: 'people' },
  { text: 'Hidrátate y usa calzado cómodo.', icon: 'droplet' },
  { text: 'Establece un punto de encuentro si vas en grupo.', icon: 'geo-alt' },
  { text: 'Consulta la meteorología antes de salir.', icon: 'cloud' }
]

const appFeatures = [
  { text: 'Favoritos persistentes en tu dispositivo.', icon: 'star' },
  { text: 'Consulta de itinerarios y horarios detallados.', icon: 'calendar' },
  { text: 'Interfaz adaptada para consulta rápida.', icon: 'phone' },
  { text: 'Datos base actualizados; confirma fuentes oficiales.', icon: 'exclamation-triangle' }
]

const enlacesA: LinkItem[] = [
  { label: 'Ayuntamiento de Écija', url: 'https://www.ecija.es/', icon: 'globe' },
  { label: 'Turismo de Écija', url: 'https://turismoecija.com/', icon: 'map' },
  { label: 'AEMET — Predicción Écija', url: 'https://www.aemet.es/es/eltiempo/prediccion/municipios/ecija-id41039', icon: 'cloud-sun' }
]
const enlacesB: LinkItem[] = [
  { label: 'Mapa OSM de Écija', url: 'https://www.openstreetmap.org/#map=15/37.542/-5.079', icon: 'signpost' },
  { label: 'YouTube — Écija Comarcal TV', url: 'https://www.youtube.com/channel/UCiL_dz_QnquAtO5LjvW-How/live', icon: 'youtube' },
  { label: 'Política de Privacidad', url: 'https://docs.google.com/document/d/e/2PACX-1vQPL4L2DYbna1ZOkkVLp6igOwxsjaF3G1QJLgrAo_CQY8hHMKMxRJiCSYGb79ktzNFPHKl9fvz8HlZP/pub', icon: 'shield-check' },
  { label: 'Soporte y Contacto', url: 'mailto:jesusdelmar11@icloud.com', icon: 'envelope' }
]

function Bullet({ text, icon = 'dot' }: { text: string; icon?: string }) {
  return (
    <li className="about-bullet">
      <i className={`bi bi-${icon}`} aria-hidden="true" />
      <span>{text}</span>
    </li>
  )
}

function LinkItemRow({ item }: { item: LinkItem }) {
  const external = item.url.startsWith('http')
  return (
    <li>
      <a
        href={item.url}
        className="about-link"
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        <i className={`bi bi-${item.icon}`} aria-hidden="true" /> {item.label}
        {external && <i className="bi bi-box-arrow-up-right ms-1 external" aria-hidden="true" />}
      </a>
    </li>
  )
}

export default function About() {
  return (
    <>
      <SeoHead
        title="Acerca de · Semana Santa Écija"
        description="Información útil, consejos y teléfonos de interés para disfrutar de la Semana Santa de Écija."
        url="/acerca-de"
      />
      <main className="about-plain container my-5" aria-labelledby="about-title">
        <header className="mb-4">
          <h1 id="about-title" className="about-plain-title">Semana Santa de Écija</h1>
          <p className="lead about-plain-lead">Guía práctica, cultural y devocional para visitantes y cofrades.</p>
        </header>

        <article className="about-article" aria-label="Contenido principal sobre la Semana Santa de Écija">
          <section className="mb-5" aria-labelledby="sec-intro">
            <h2 id="sec-intro" className="section-heading">Introducción</h2>
            <p>
              La Semana Santa de Écija combina patrimonio barroco, tradición y un clima de recogimiento que envuelve calles y plazas.
              Cortejos elegantes, silencio en ciertos tramos y el cromatismo de hábitos e insignias la convierten en una vivencia singular.
              La Carrera Oficial se organiza en torno a la Plaza de España ("El Salón"), eje donde confluyen hermandades y visitantes.
            </p>
            <p>
              Esta aplicación facilita una consulta ágil de horarios, itinerarios aproximados y la marcación de hermandades favoritas
              para tenerlas a mano durante los días de la semana mayor.
            </p>
          </section>

          <section className="mb-5" aria-labelledby="sec-puntos">
            <h2 id="sec-puntos" className="section-heading">Puntos de interés</h2>
            <ul className="about-bullets list-unstyled">
              {puntosInteres.map(p => <Bullet key={p} text={p} icon="pin-map" />)}
            </ul>
          </section>

          <section className="mb-5" aria-labelledby="sec-consejos">
            <h2 id="sec-consejos" className="section-heading">Consejos útiles</h2>
            <ul className="about-bullets list-unstyled">
              {consejos.map(c => <Bullet key={c.text} text={c.text} icon={c.icon} />)}
            </ul>
          </section>

          <section className="mb-5" aria-labelledby="sec-logistica">
            <h2 id="sec-logistica" className="section-heading">Logística para visitantes</h2>
            <p>
              Aparcamiento periférico recomendado en jornadas de máxima afluencia. El centro histórico registra cortes escalonados;
              conviene prever rutas alternativas. La restauración incrementa ocupación en mediodía y primeras horas de la noche: reserva
              o acude con margen.
            </p>
            <p>
              En fotografía evita el uso de flash directo a imágenes o pasos. Mantén silencio en zonas de recogimiento y protege los
              itinerarios dejando libre el recorrido. Lleva batería externa: la consulta frecuente de mapas y favoritos consume energía.
            </p>
          </section>

          <section className="mb-5" aria-labelledby="sec-app">
            <h2 id="sec-app" className="section-heading">Sobre la aplicación</h2>
            <ul className="about-bullets list-unstyled">
              {appFeatures.map(f => <Bullet key={f.text} text={f.text} icon={f.icon} />)}
            </ul>
          </section>

          <section className="mb-5" aria-labelledby="sec-enlaces">
            <h2 id="sec-enlaces" className="section-heading">Enlaces de interés</h2>
            <div className="row g-4 about-links">
              <div className="col-md-6">
                <ul className="list-unstyled m-0">
                  {enlacesA.map(e => <LinkItemRow key={e.url} item={e} />)}
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-unstyled m-0">
                  {enlacesB.map(e => <LinkItemRow key={e.url} item={e} />)}
                </ul>
              </div>
            </div>
          </section>

          <hr className="about-divider" />
        </article>
      </main>
    </>
  )
}
