# Plan de Implementación y Análisis: Sistema de Incidencias en Tiempo Real

## 1. Visión General
Este documento detalla el análisis técnico para integrar un sistema de **Alertas en Tiempo Real** en la aplicación *Semana Santa Écija*.

### El Problema
La aplicación actual carga datos estáticos (horarios, itinerarios) que no pueden modificarse una vez la app está compilada e instalada en los teléfonos. Ante imprevistos (lluvia, retrasos), los usuarios no reciben información actualizada.

### La Solución
Implementar un canal de comunicación unidireccional `Telegram -> App` que permita publicar avisos instantáneos sin costes de infraestructura.

---

## 2. Arquitectura de la Solución

**Componentes:**
1.  **Bot de Telegram (Input):** Interfaz para enviar comandos.
2.  **n8n (Procesador):** Servidor de automatización que interpreta los comandos.
3.  **GitHub Gist (Base de Datos):** Alojamiento gratuito de un fichero JSON público que actúa como backend.
4.  **App (Cliente):** Consume el fichero JSON periódicamente.

```mermaid
graph LR
    Admin[📱 Tu Móvil] -->|/aviso retraso| Telegram[🤖 Bot Telegram]
    Telegram -->|Webhook| n8n[⚙️ Servidor n8n]
    n8n -->|PATCH| Gist[☁️ GitHub Gist json]
    App[📱 App Usuarios] -->|GET (cada 60s)| Gist
```

---

## 3. Modelo de Datos (`status.json`)

El archivo alojado en GitHub Gist tendrá esta estructura. Al estar separado de la lógica de la app, es flexible y ligero.

```json
{
  "meta": {
    "lastUpdated": "2026-03-29T17:45:00Z",
    "version": "1.0"
  },
  "global": {
    "active": false,
    "message": "",
    "type": "info"
  },
  "alerts": {
    "10452": {  // ID de la Hermandad (coincide con el sistema)
      "isActive": true,
      "type": "warning", // warning | danger | info
      "title": "Retraso de 30 min",
      "message": "La hermandad pospone su salida por inclemencias.",
      "timestamp": "2026-03-29T17:40:00Z"
    }
  }
}
```

---

## 4. Guía de Implementación Técnica

### Fase A: Preparación del Entorno (Backend)
**Coste: 0€**

1.  **GitHub Gist**:
    *   Crear un Gist público llamado `ecija-status.json` inicializado con `{ "alerts": {} }`.
    *   Obtener el token (Classic Token) con permiso `gist`.
2.  **Servidor n8n**:
    *   **Opción A (Recomendada Producción):** Desplegar en **Oracle Cloud Free Tier** (VPS Ampere 4 OCPU, 24GB RAM gratis de por vida).
    *   **Opción B (Desarrollo):** Ejecutar localmente en tu PC (`npx n8n start`) y usar un túnel (ngrok) para conectar con Telegram.
3.  **Bot de Telegram**:
    *   Crear con @BotFather y obtener token.

### Fase B: Flujo de Trabajo en n8n
El workflow deberá:
1.  Recibir el mensaje del chat.
2.  Identificar la hermandad (buscar coincidencia de nombre en un diccionario `Nombre -> ID`).
3.  Descargar el `ecija-status.json` actual.
4.  Insertar/Modificar la alerta correspondiente.
5.  Subir el archivo actualizado.

### Fase C: Integración en la App (React / Native)

Sigue estos pasos para modificar el código:

1.  **Crear Hook `useLiveStatus`**:
    Este hook descarga el JSON cada 60 segundos. Es vital añadir `?t=TIMESTAMP` a la URL para evitar que la caché del móvil muestre datos viejos.

2.  **UI de Alertas**:
    En `HermandadDetail`, lee el ID de la hermandad y busca si existe una entrada en `alerts`.
    *   Si existe y `isActive: true`, renderiza un bloque de color llamativo (Amarillo/Rojo) arriba del todo.

---

## 5. Diseño de Comandos
Propuesta de comandos para gestionar todo desde Telegram:

| Comando | Efecto | Ejemplo |
| :--- | :--- | :--- |
| `/retraso [nombre] [tiempo]` | Crea alerta amarilla "Retraso". | `/retraso borriquita 30 min` |
| `/rojo [nombre] [mensaje]` | Crea alerta roja (Suspensión/Grave). | `/rojo silencio Se suspende la estación` |
| `/info [nombre] [mensaje]` | Crea alerta azul (Info). | `/info yedra Cambia recorrido por obra` |
| `/ok [nombre]` | Borra la alerta y vuelve a normalidad. | `/ok borriquita` |
| `/global [mensaje]` | Mensaje en CABECERA DE TODA LA APP. | `/global Alerta meteorológica activa` |

## 6. Plan de Contingencia (Robustez)
¿Qué pasa si el servidor n8n se cae en plena Semana Santa?

Dado que el "cerebro" (n8n) está desacoplado de la "memoria" (Gist):
1.  La App **sigue funcionando** y leyendo el último estado conocido desde GitHub.
2.  Tú puedes **editar manualmente** el archivo JSON en la web de GitHub desde tu móvil para poner/quitar alertas de emergencia.
3.  El sistema es, por tanto, extremadamente robusto.
