# Guía: Cómo obtener tu Token de GitHub (Personal Access Token)

Para que n8n pueda leer y escribir en tu **GitHub Gist** (donde guardamos las incidencias), necesitas una "llave de acceso" llamada Token. Sigue estos pasos:

---

## 1. Acceder a la configuración de seguridad
1. Inicia sesión en tu cuenta de [GitHub](https://github.com).
2. Haz clic en tu foto de perfil (arriba a la derecha) y selecciona **Settings**.
3. En el menú de la izquierda, baja hasta el final y haz clic en **Developer settings**.

---

## 2. Crear el Token
1. Haz clic en **Personal access tokens** y luego selecciona **Tokens (classic)**.
   * *Nota: Es más sencillo usar la versión "classic" para este proyecto.*
2. Pulsa el botón **Generate new token** y elige **Generate new token (classic)**.

---

## 3. Configurar el Token
1. **Note:** Dale un nombre para recordarlo, por ejemplo: `n8n-semana-santa-ecija`.
2. **Expiration:** Cámbialo a `No expiration` (o ponle una fecha larga) para que el bot no deje de funcionar de repente.
3. **Select scopes (Permisos):**
   * Busca la casilla que dice **`gist`** y márcala.
   * **¡IMPORTANTE!** Solo necesitas marcar la casilla `gist`. No marques nada más por seguridad.

---

## 4. Guardar el Token
1. Baja hasta el final de la página y pulsa **Generate token**.
2. **Copia el código que aparece (empieza por `ghp_...`).**
   * **ADVERTENCIA:** Solo verás este código una vez. Si cierras la página sin copiarlo, tendrás que borrarlo y crear uno nuevo.
3. Este es el código que debes pegar en **n8n** (Credencial Header Auth -> Value: `token TU_TOKEN`).

---

## 5. Obtener el GIST_ID
Para que el flujo de n8n sepa exactamente QUÉ archivo editar:
1. Ve a tu [lista de Gists](https://gist.github.com/mine).
2. Haz clic en el nombre de tu archivo (ej: `status.json`).
3. Mira la URL en el navegador. Es algo como: `github.com/TuUsuario/abcdef1234567890abcdef1234567890`.
4. El **GIST_ID** es esa cadena de letras y números del final (`abcdef...`). Cópialo porque lo necesitarás para los nodos de n8n.
