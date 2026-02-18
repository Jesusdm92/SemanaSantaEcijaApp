# Guía Rápida: Cómo crear tu Bot de Telegram con @BotFather

Para que tu sistema de incidencias funcione, necesitas un Bot de Telegram que actúe como "mando a distancia". Sigue estos pasos exactos:

---

## 1. Localizar al "Padre de los Bots"
1. Abre tu aplicación de Telegram (Móvil o PC).
2. En el buscador de contactos, escribe **@BotFather**.
3. Asegúrate de que tenga el **tic azul de verificado**.
4. Pulsa el botón **"Iniciar"** o escribe `/start`.

---

## 2. Crear el nuevo Bot
1. Escribe el comando: `/newbot`
2. **Nombre del Bot:** Te pedirá un nombre público (el que verás arriba en el chat).
   * *Ejemplo:* `Control Semana Santa Écija`
3. **Nombre de Usuario (Username):** Te pedirá un ID único. 
   * **REGLA:** Debe terminar obligatoriamente en la palabra `bot`.
   * *Ejemplo:* `ecija_ss_control_bot` o `MiHermandadAppBot`.
   * *Si te dice que ya existe, intenta con otro nombre hasta que lo acepte.*

---

## 3. Obtener el Token (La llave)
Una vez creado, @BotFather te enviará un mensaje de felicitación con un texto en rojo/negrita similar a este:
`123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`

**Este es tu API TOKEN.**
*   **No lo compartas con nadie.**
*   Cópialo y pégalo en la configuración de **n8n** (Credencial Telegram API).

---

## 4. Configurar Comandos (Opcional pero recomendado)
Para que cuando escribas `/` en el chat te salgan las opciones automáticamente:

1. Escribe `/setcommands` en BotFather.
2. Selecciona tu bot.
3. Copia y pega esta lista completa:
   ```text
   aviso - [hermandad] [texto] -> Alerta amarilla
   peligro - [hermandad] [texto] -> Alerta roja (grave)
   info - [hermandad] [texto] -> Información azul
   ok - [hermandad] -> Quitar alerta de una hermandad
   global - [texto] -> Aviso para TODA la App
   global_ok - Quitar el aviso global
   ```

---

## 5. ¡A probar!
1. Haz clic en el enlace que te dio BotFather (ej: `t.me/tu_bot`).
2. Pulsa **Iniciar**.
3. Si ya tienes n8n configurado y activo, prueba a escribir: `/global Probando sistema`
4. Deberías recibir una confirmación del Bot en unos segundos.
