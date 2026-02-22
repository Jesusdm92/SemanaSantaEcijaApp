# 🚀 Guía de Publicación en Google Play Store
## Cruz de Guía Écija — `com.jesusdm92.semanasantaecijaapp`

> **Requisitos previos:**
> - ✅ Cuenta de desarrollador Android Google Play Console activa
> - ✅ EAS CLI instalado (`npm install -g eas-cli`)
> - ✅ Sesión activa en Expo (`eas login`)
> - ✅ Proyecto EAS vinculado (`projectId: 6e68a564-6466-4c27-bd38-25c6c2adc84f`)

---

## 📋 ÍNDICE

1. [Preparar la versión para producción](#1-preparar-la-versión-para-producción)
2. [Build de producción con EAS](#2-build-de-producción-con-eas)
3. [Descargar y verificar el AAB](#3-descargar-y-verificar-el-aab)
4. [Configurar EAS Submit (opcional, recomendado)](#4-configurar-eas-submit-opcional-recomendado)
5. [Subir manualmente a Google Play Console](#5-subir-manualmente-a-google-play-console)
6. [Completar la ficha de la app en Play Console](#6-completar-la-ficha-de-la-app-en-play-console)
7. [Enviar a revisión](#7-enviar-a-revisión)
8. [Publicar actualizaciones futuras](#8-publicar-actualizaciones-futuras)

---

## 1. Preparar la versión para producción

### 1.1 Actualizar la versión en `app.config.js`

Antes de cada build de producción, incrementa la versión en `SemanaSantaEcijaAppNative/app.config.js`:

```js
// Primera publicación:
"version": "1.0.0",       // Versión que ve el usuario en Play Store
"versionCode": 1,          // Número entero, debe incrementarse en CADA build

// Segunda publicación (ejemplo):
"version": "1.1.0",
"versionCode": 2,
```

> ⚠️ **IMPORTANTE:** El `versionCode` NUNCA puede repetirse ni bajar. Google Play rechaza builds con el mismo `versionCode` o uno inferior.

### 1.2 Verificar las variables de entorno

Asegúrate de que el archivo `.env` en `SemanaSantaEcijaAppNative/` tiene todas las variables necesarias:

```bash
# SemanaSantaEcijaAppNative/.env
EXPO_PUBLIC_SUPABASE_URL=tu_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_key
```

> Las variables `EXPO_PUBLIC_` se incluyen en el bundle. Las variables SIN ese prefijo (secretos del servidor) se gestionan desde la [consola de EAS](https://expo.dev/accounts/jesusdm92/projects/cruz-de-guia-ecija/secrets).

### 1.3 Verificar `google-services.json`

Confirma que `google-services.json` en la raíz del proyecto nativo está actualizado y es el correcto para el paquete `com.jesusdm92.semanasantaecijaapp`.

---

## 2. Build de producción con EAS

El perfil `production` en `eas.json` genera un **AAB (Android App Bundle)**, que es el formato requerido por Google Play.

```bash
# Navegar al directorio de la app nativa
cd "C:\Users\jesus\Proyectos\Sema Santa React\SemanaSantaEcijaAppNative"

# Lanzar el build de producción para Android
eas build --platform android --profile production
```

### ¿Qué ocurre durante el build?

1. EAS sube el código fuente a los servidores de Expo Cloud
2. Se compila la app con Gradle en los servidores de Expo
3. **La primera vez:** EAS genera automáticamente un keystore de firma y lo guarda de forma segura en Expo Cloud. No necesitas gestionar el keystore manualmente.
4. Se genera el archivo `.aab` firmado, listo para Play Store

### Monitorizar el build

Puedes ver el progreso en tiempo real en la terminal, o acceder a:
```
https://expo.dev/accounts/jesusdm92/projects/cruz-de-guia-ecija/builds
```

El build tarda aproximadamente **10-20 minutos**.

---

## 3. Descargar y verificar el AAB

Cuando el build finalice con éxito:

1. EAS mostrará en la terminal un enlace de descarga
2. Descarga el archivo `.aab` (ejemplo: `build-1234567890.aab`)
3. Puedes verificar el build en: `https://expo.dev/accounts/jesusdm92/projects/cruz-de-guia-ecija/builds`

---

## 4. Configurar EAS Submit (opcional, recomendado)

EAS Submit puede subir automáticamente el AAB a Play Console. Para ello necesita una **clave de API de servicio de Google**.

### 4.1 Crear la clave de API en Google Play Console

1. Ve a [Google Play Console](https://play.google.com/console/)
2. Navega a **Configuración → Acceso a la API**
3. Si no tienes un proyecto de Google Cloud vinculado, vincúlalo
4. En la sección **Cuentas de servicio**, haz clic en **"Crear nueva cuenta de servicio"**
5. Se abrirá Google Cloud Console. Crea la cuenta de servicio y descarga el archivo JSON de credenciales
6. De vuelta en Play Console, otorga a la cuenta de servicio el permiso de **"Publicador"** o **"Administrador"**

### 4.2 Guardar las credenciales en EAS

```bash
# Subir el archivo JSON de la cuenta de servicio a EAS
eas secret:create --scope project --name GOOGLE_SERVICE_ACCOUNT_KEY --type file --value ./ruta/al/archivo-credenciales.json
```

### 4.3 Configurar `eas.json` para el submit

Edita `SemanaSantaEcijaAppNative/eas.json`:

```json
{
    "cli": {
        "version": ">= 10.0.0",
        "appVersionSource": "local"
    },
    "build": {
        "development": {
            "developmentClient": true,
            "distribution": "internal"
        },
        "preview": {
            "android": {
                "buildType": "apk"
            }
        },
        "production": {}
    },
    "submit": {
        "production": {
            "android": {
                "serviceAccountKeyPath": "./credenciales-google.json",
                "track": "internal"
            }
        }
    }
}
```

> El valor de `track` puede ser: `internal`, `alpha`, `beta` o `production`.

### 4.4 Lanzar build + submit en un solo comando

```bash
eas build --platform android --profile production --auto-submit
```

O si ya tienes el AAB y quieres solo enviarlo:

```bash
eas submit --platform android --profile production
```

---

## 5. Subir manualmente a Google Play Console

Si prefieres hacerlo manualmente (sin EAS Submit):

### 5.1 Primera publicación — Crear la app

1. Ve a [Google Play Console](https://play.google.com/console/)
2. Haz clic en **"Crear aplicación"**
3. Rellena:
   - **Nombre de la app:** `Cruz de Guía Écija`
   - **Idioma predeterminado:** Español
   - **Tipo:** Aplicación
   - **Gratis o de pago:** Gratis
4. Acepta las políticas y haz clic en **"Crear aplicación"**

### 5.2 Subir el AAB

1. En el menú lateral, ve a **Producción → Versiones → Crear nueva versión**
   - (O empieza por **Pruebas internas** para hacer pruebas antes de publicar)
2. En la sección **"App Bundles"**, haz clic en **"Subir"** y selecciona tu archivo `.aab`
3. Espera a que se procese (puede tardar unos minutos)
4. Rellena el campo **"Novedades de esta versión"**:
   ```
   Versión inicial de Cruz de Guía Écija.
   Sigue la Semana Santa de Écija con notificaciones en tiempo real, 
   itinerarios de hermandades, galería de imágenes y más.
   ```
5. Haz clic en **"Guardar"** y luego en **"Revisar versión"**

---

## 6. Completar la ficha de la app en Play Console

Google requiere rellenar varias secciones antes de poder publicar. Puedes hacerlo mientras el AAB se procesa.

### 6.1 Información de la app (Panel Principal → Configuración)

| Campo | Valor sugerido |
|-------|---------------|
| **Nombre de la app** | Cruz de Guía Écija |
| **Descripción breve** | Sigue la Semana Santa de Écija en tiempo real |
| **Descripción completa** | (Ver plantilla abajo) |
| **Categoría** | Estilo de vida / Regional |
| **Correo de contacto** | Tu email |
| **URL de política de privacidad** | Obligatorio (ver punto 6.3) |

### Plantilla de descripción completa:

```
Cruz de Guía Écija es la app oficial para seguir la Semana Santa 
de Écija en tiempo real.

🔔 NOTIFICACIONES EN TIEMPO REAL
Recibe alertas sobre la salida y recogida de las hermandades al momento.

📍 ITINERARIOS DETALLADOS  
Consulta el recorrido completo de cada hermandad con calles y horarios.

📸 GALERÍA DE IMÁGENES
Explora fotografías de los pasos y hermandades de Écija.

⭐ TUS FAVORITAS
Guarda tus hermandades favoritas para un acceso rápido.

🌦️ TIEMPO EN ÉCIJA
Consulta la previsión meteorológica actualizada para no perderte ninguna salida.

📺 TV EN DIRECTO
Accede al canal de TV regional con retransmisiones en directo.

La aplicación no requiere registro y es completamente gratuita.
```

### 6.2 Recursos gráficos (Presencia en Play Store → Recursos gráficos)

Necesitarás preparar estas imágenes:

| Recurso | Dimensiones | Notas |
|---------|-------------|-------|
| **Icono de la app** | 512 × 512 px (PNG) | Usa `assets/icon-optimized.png` redimensionado |
| **Gráfico de presentación** | 1024 × 500 px (PNG/JPG) | Banner horizontal, requerido |
| **Capturas de pantalla** | Mín. 2, recomendado 4-8 | Pantallas reales de la app |

> 💡 **Tip:** Puedes hacer capturas de pantalla usando el emulador de Android Studio o desde un dispositivo físico ejecutando `eas build --profile preview` (APK para pruebas).

### 6.3 Política de privacidad

Google **requiere** una URL de política de privacidad. Opciones:

1. **Sube el archivo `PoliticaPrivacidad.txt`** que ya tienes en el proyecto a tu servidor web o a GitHub Pages
2. Usa un generador gratuito como [privacypolicygenerator.info](https://www.privacypolicygenerator.info/)
3. Hospeda el archivo en una URL pública y configúrala en la ficha

### 6.4 Clasificación de contenido

1. Ve a **Política → Clasificación de contenido**
2. Completa el cuestionario (la app no tiene contenido violento, sexual, etc.)
3. Google asignará automáticamente las clasificaciones por edad

### 6.5 Público objetivo y contenido

1. Ve a **Política → Público objetivo y contenido**
2. Selecciona: **"18 años o más"** (o el rango que corresponda)
3. Confirma que la app no está dirigida a menores

### 6.6 Acceso a la app

1. Ve a **Política → Acceso a la app**
2. Si la app no requiere login: selecciona **"Todo el contenido de la app es accesible sin necesidad de acceder"**

### 6.7 Anuncios

Indica si la app contiene anuncios: **"No contiene anuncios"**

### 6.8 Declaración de permisos de datos (Privacy)

1. Ve a **Política → Seguridad de los datos**
2. Declara los datos que recopila la app:
   - **Identificadores del dispositivo** (tokens de notificación push) → Sí, se recopilan
   - **Datos de ubicación** → No (si no usas GPS)
   - **Fotos/media** → Sí (si el usuario puede subir fotos a la galería)

---

## 7. Enviar a revisión

### Flujo recomendado para la primera publicación:

```
Pruebas internas (0-5 testers tuyos)
    ↓ (verificar que todo funciona)
Pruebas cerradas / Alpha (grupo más amplio, opcional)
    ↓ (opcional)
Pruebas abiertas / Beta (cualquiera puede unirse, opcional)
    ↓
Producción (publicación general)
```

### Para publicar en Producción:

1. Ve a **Producción → Versiones → Tu versión borrador**
2. Revisa que todas las secciones obligatorias estén completadas (aparecerán en verde ✅)
3. Haz clic en **"Enviar para revisión"**

### Tiempos de revisión:

- **Primera publicación:** 3-7 días hábiles (Google revisa nuevas apps más en profundidad)
- **Actualizaciones:** 1-3 días hábiles normalmente
- Recibirás un email cuando la revisión esté completa

---

## 8. Publicar actualizaciones futuras

Para cada nueva versión de la app:

### 8.1 Actualizar versiones en `app.config.js`

```js
// Incrementar ambos valores
"version": "1.1.0",   // Lo que ve el usuario
"versionCode": 2,      // Debe ser mayor que el anterior (era 1)
```

### 8.2 Lanzar nuevo build de producción

```bash
cd "C:\Users\jesus\Proyectos\Sema Santa React\SemanaSantaEcijaAppNative"
eas build --platform android --profile production
```

### 8.3 Subir a Play Console

- **Con EAS Submit:** `eas submit --platform android --profile production`
- **Manual:** En Play Console → Producción → Crear nueva versión → Subir el nuevo AAB

---

## 🔑 Comandos de referencia rápida

```bash
# Desde: C:\Users\jesus\Proyectos\Sema Santa React\SemanaSantaEcijaAppNative

# Verificar sesión en Expo
eas whoami

# Build de producción (AAB para Play Store)
eas build --platform android --profile production

# Build de preview (APK para pruebas en dispositivo)
eas build --platform android --profile preview

# Subir a Play Store automáticamente
eas submit --platform android --profile production

# Build + submit en un comando
eas build --platform android --profile production --auto-submit

# Ver historial de builds
eas build:list --platform android

# Ver secretos del proyecto
eas secret:list
```

---

## ⚠️ Checklist antes de cada publicación

- [ ] `versionCode` incrementado (nunca repetir)
- [ ] `version` actualizada
- [ ] Variables de entorno correctas en EAS Cloud
- [ ] `google-services.json` actualizado si hubo cambios en Firebase
- [ ] Build de preview probado en dispositivo físico
- [ ] Novedades de la versión redactadas en Play Console

---

## 🆘 Problemas comunes

| Problema | Solución |
|----------|----------|
| Build falla por `google-services.json` | Verificar que el `package_name` en el JSON coincide con `com.jesusdm92.semanasantaecijaapp` |
| Error de versión duplicada | Incrementar `versionCode` en `app.config.js` |
| Notificaciones no llegan tras publicar | Verificar tokens en Supabase y que el `google-services.json` de producción está bien configurado |
| Google rechaza la app | Leer el motivo en el email/Play Console y corregir según las políticas indicadas |
| El AAB no sube a Play (firma) | EAS gestiona el keystore; si pierdes acceso, contacta al soporte de Expo para recuperarlo |

---

*Documento generado: Febrero 2026*
*App: Cruz de Guía Écija — `com.jesusdm92.semanasantaecijaapp`*
*EAS Project ID: `6e68a564-6466-4c27-bd38-25c6c2adc84f`*
