# Guía de Configuración: Bot de Telegram + n8n + GitHub Gist

Esta guía te explica paso a paso cómo crear el "cerebro" que controlará las incidencias de tu App.

---

## 1. Crear el Bot de Telegram (Input)
Necesitas un "robot" al que hablarle para enviar las alertas.

1.  Abre Telegram y busca el usuario **@BotFather** (tiene un tic azul de verificado).
2.  Escribe el comando `/newbot`.
3.  Te pedirá un **nombre visible** (ej: `Control Semana Santa Écija`).
4.  Te pedirá un **usuario único** terminado en `bot` (ej: `EcijaSemanaSantaAdminBot`).
5.  **¡IMPORTANTE!** Te responderá con un mensaje largo. Copia el **TOKEN** que aparece en rojo/negrita (es algo como `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`). Guárdalo como oro en paño.

---

## 2. Preparar GitHub Gist (Base de Datos)
Aquí es donde se guardará la información pública.

1.  Ve a [gist.github.com](https://gist.github.com) (inicia sesión con tu cuenta).
2.  Crea un nuevo Gist:
    *   **Descripción:** `Estado Semana Santa App`
    *   **Nombre del archivo:** `status.json`
    *   **Contenido Inicial:** Copia y pega EXACTAMENTE esto:
        ```json
        {
          "meta": { "lastUpdated": "", "version": "1.0" },
          "global": { "active": false, "message": "", "type": "info" },
          "alerts": {}
        }
        ```
3.  Pulsa **"Create public gist"**.
4.  En la barra de direcciones de tu navegador, verás algo como `gist.github.com/TuUsuario/abcd12345...`. Ese código final es tu **GIST_ID**.
5.  Ahora necesitas una **llave** para que n8n pueda escribir ahí:
    *   Ve a [github.com/settings/tokens](https://github.com/settings/tokens).
    *   "Generate new token (classic)".
    *   Dale un nombre ("n8n Gist Write") y marca la casilla **`gist`**.
    *   Genera y copia el token (empieza por `ghp_...`).

---

## 3. Configurar el Flujo en n8n (El Cerebro)

### Concepto del Workflow
El flujo hace esto: `Recibe mensaje Telegram` -> `Descarga Gist actual` -> `Modifica JSON` -> `Sube Gist nuevo`.

### Pasos en n8n:

1.  **Nodo 1: Telegram Trigger**
    *   **Credential:** Crea una nueva credencial "Telegram API" y pega el TOKEN que te dio BotFather.
    *   **Updates:** Marks 'Message'.

2.  **Nodo 2: Switch (Router de Comandos)**
    *   Analiza el texto del mensaje (`{{ $json.message.text }}`).
    *   **Ruta 1 (Aviso):** Si empieza por `/aviso`.
    *   **Ruta 2 (Cancelar):** Si empieza por `/cancelar`.
    *   **Ruta 3 (Limpiar):** Si empieza por `/ok`.

3.  **Nodo 3: HTTP Request (GET Gist)**
    *   **URL:** `https://api.github.com/gists/TU_GIST_ID`
    *   **Authentication:** "Header Auth". Name: `Authorization`, Value: `token TU_TOKEN_GITHUB_GHP`.
    *   Esto descargará el JSON actual.

4.  **Nodo 4: Code (Lógica Javascript)**
    *   Aquí es donde ocurre la magia. Tienes que unir el mensaje de Telegram con el JSON descargado.
    *   Ejemplo de lógica para `/aviso [hermandad] [mensaje]`:
        ```javascript
        const json = items[0].json; // Datos del Gist
        const text = $('Telegram Trigger').item.json.message.text; // "/aviso borriquita lluvia"
        
        // 1. Parsear comando
        const parts = text.split(' ');
        const comando = parts[0];
        const nombreHermandad = parts[1].toLowerCase();
        const mensaje = parts.slice(2).join(' ');

        // 2. Diccionario de Nombres a IDs (¡Debes rellenar esto!)
        const map = {
            "borriquita": "123456", // ID real de tu app
            "cautivo": "789012"
        };
        
        const id = map[nombreHermandad];
        
        // 3. Actualizar JSON
        if (id) {
            const currentContent = JSON.parse(json.files['status.json'].content);
            currentContent.alerts[id] = {
                isActive: true,
                type: 'warning', // Amarillo
                title: 'Aviso Importante',
                message: mensaje,
                timestamp: new Date().toISOString()
            };
            
            return { json: { content: JSON.stringify(currentContent) } };
        }
        ```

5.  **Nodo 5: HTTP Request (PATCH Gist)**
    *   Actualiza el fichero en la nube.
    *   **Method:** PATCH.
    *   **URL:** `https://api.github.com/gists/TU_GIST_ID`
    *   **Body:** `{{ $json }}` (el resultado del nodo Code, que ya tiene el formato `{ "files": { "status.json": { "content": "..." } } }`).

6.  **Nodo 6: Telegram (Respuesta)**
    *   Envía un mensaje de vuelta al chat: "✅ Alerta publicada correctamente".

¡Y listo! Una vez activo, la App (que ya programamos para leer ese Gist cada 60s) mostrará las alertas automáticamente.
