# SemanaSantaEcijaApp (React Native / Expo)

Proyecto móvil (Expo + React Native) derivado de la versión web (Vite + React 18). Permite reutilizar datos y lógica para ofrecer una experiencia nativa.

## Tecnologías
- Expo SDK 54
- React Native 0.81 / React 19
- React Navigation (stack + bottom tabs)
- AsyncStorage (favoritos)
- TypeScript
- react-native-webview (embeds de redes sociales)

## Estructura
```
SemanaSantaEcijaAppNative/
  assets/
    data/hermandades-2025.json
  src/
    config/
      socialConfig.ts          # Mapeo hermandadId → usuario de X (Twitter)
    context/HermandadesContext.tsx
    types/
      hermandad.ts
      navigation.ts
      incidencias.ts
    theme/colors.ts
    components/
      HermandadCard.tsx
      AlertBanner.tsx          # Banner de incidencias en tiempo real
      TwitterFeed.tsx          # Feed embebido de X (Twitter) — optimizado
      UserGalleryModal.tsx     # Galería personal de fotos por hermandad
    screens/
      SplashScreen.tsx
      HermandadesList.tsx
      HermandadDetail.tsx
      Favoritos.tsx
      About.tsx
      HoySale.tsx              # Qué hermandad sale hoy
      PorDias.tsx              # Vista por días de la semana
      AgendaCofrade.tsx        # Agenda del cofrade
    hooks/
    utils/
      escudos.ts
      headers.ts
  App.tsx
```

## Scripts
```
npm start        # inicia Metro y Expo
npm run android  # build/lanza en emulador Android
npm run ios      # build/lanza en simulador iOS (macOS necesario)
npm run web      # prueba versión web (limitada)
```

## Adaptaciones clave respecto a la versión web
| Aspecto            | Web (React Vite)            | Móvil (Expo RN)                     |
|--------------------|-----------------------------|--------------------------------------|
| Router              | react-router-dom            | react-navigation (stack + tabs)      |
| Estado favoritos    | localStorage                | AsyncStorage                         |
| UI / Layout         | Bootstrap + CSS             | Flexbox + StyleSheet                 |
| Icons               | Bootstrap Icons             | @expo/vector-icons (Ionicons)        |
| Assets estáticos    | public/                     | assets/                              |
| Redes sociales      | N/A                         | react-native-webview (TwitterFeed)   |

---

## 🐦 Feed de X (Twitter) — TwitterFeed

Sección de noticias de X integrada en la pantalla de detalle de cada hermandad (`HermandadDetail.tsx`). Muestra el timeline embebido de la cuenta de X de la hermandad.

### Arquitectura

```
socialConfig.ts  →  TwitterFeed.tsx  →  HermandadDetail.tsx
(datos)              (componente)        (integración)
```

### Configuración — `src/config/socialConfig.ts`

Este archivo contiene el mapeo entre el ID numérico de cada hermandad y su nombre de usuario en X (**sin la @**):

```typescript
export const twitterHandles: Record<number, string> = {
  75910: 'amoryconcepcion', // Amor (El Olivo)
  26978: '',                // Borriquita       ← vacío = no se muestra
  57188: '',                // Cautivo y Lágrimas
  // ... etc
}
```

**Para configurar una hermandad**, simplemente reemplaza `''` por el usuario de X. Si el valor está vacío, la sección **no aparece** en la pantalla de detalle (cero impacto en rendimiento).

### Optimizaciones implementadas

| Requisito                | Implementación                                                                 |
|--------------------------|--------------------------------------------------------------------------------|
| **Lazy Loading**         | El WebView/iframe solo se monta cuando el usuario pulsa "Cargar noticias de X" |
| **Spinner personalizado**| `ActivityIndicator` con `colors.primary` (#4b0082) + texto "Cargando noticias…"|
| **Caché / Optimización** | `startInLoadingState`, `domStorageEnabled`, `androidLayerType="hardware"`      |
| **Estabilidad visual**   | Contenedor con `height: 500px` fijo para evitar layout shift                   |
| **Fallback automático**  | Si Twitter falla (rate limit, etc.), muestra un enlace directo al perfil        |

### Comportamiento por plataforma

| Plataforma       | Mecanismo                                                                      |
|------------------|--------------------------------------------------------------------------------|
| **Android/iOS**  | `react-native-webview` con HTML embebido + `widgets.js` de Twitter             |
| **Web (Expo)**   | `<iframe>` con URL de `syndication.twitter.com` + detección de rate limit      |

### Detección automática de Rate Limit (Web)

En la versión web, Twitter puede devolver "Rate limit exceeded" como texto plano dentro del iframe (status 200, sin disparar `onError`). Para detectarlo automáticamente:

1. Se escucha `window.addEventListener('message', ...)` esperando un `postMessage` del widget de Twitter que incluya `'twttr'`.
2. Si en **8 segundos** no llega esa señal, se asume que el widget falló y se muestra el **fallback** automáticamente.
3. El fallback muestra un botón **"Abrir en X"** que lleva al perfil directamente y un enlace de **"Reintentar carga"**.

### Flujo del usuario

```
[Pantalla detalle hermandad]
        │
        ▼
[Sección "Noticias de X"]
   Botón "Cargar noticias de X"
        │
        ▼ (pulsa)
  ┌─────────────────┐
  │  Spinner carga  │
  └────────┬────────┘
           │
     ┌─────┴──────┐
     ▼             ▼
 [OK: Timeline]  [Error/Rate Limit]
                   │
                   ▼
             [Fallback]
          "Abrir en X" + "Reintentar"
```

---

## 📸 Galería de Usuario — UserGalleryModal

Sistema de galería personal que permite a los usuarios guardar sus propias fotos de cada hermandad dentro de la app.

### Características Clave

| Funcionalidad | Descripción |
|---|---|
| **Persistencia Local** | Las fotos se guardan en el sistema de archivos de la app (`FileSystem.documentDirectory`). |
| **Copia de Seguridad** | Opción para guardar automáticamente una copia en la galería del dispositivo (iOS/Android) usando `expo-media-library`. |
| **Gestión en Lote** | **Modo Selección** (Long-press) para borrar múltiples fotos a la vez. |
| **Visor Premium** | Visualizador a pantalla completa con **swipe horizontal** (Carrusel), zoom y eliminación directa. |
| **UX Nativa** | **Haptic feedback** (vibración) al interactuar, animaciones suaves y **Toasts** informativos. |

### Flujo de Datos

1. **Captura/Selección**: `expo-image-picker` (Cámara o Galería).
2. **Almacenamiento**:
   - **App**: Se copia la imagen a la carpeta `gallery/{hermandadId}/` de la app.
   - **Dispositivo**: Se solicita permiso para guardar copia en `MediaLibrary` (opcional).
3. **Persistencia**: `AsyncStorage` guarda el índice de rutas de las fotos por hermandad.

### Privacidad

El sistema está diseñado con un enfoque **privacy-first**:
- Las fotos **nunca** se suben a ningún servidor externo.
- Todo el procesamiento y almacenamiento es 100% local en el dispositivo del usuario.

### Estructura de Componentes

- **`useLocalPhotos` (Hook)**: Lógica de negocio (CRUD, permisos, sistema de archivos).
- **`UserGalleryModal` (UI)**: Interfaz visual (Grid, Visor, Selección).
- **`PhotoThumb`**: Componente memoizado para máximo rendimiento en listas largas.

---

## Próximos pasos
1. Completar los usuarios de X en `socialConfig.ts` para todas las hermandades.
2. Integrar modo oscuro (usar `Appearance` / `useColorScheme`).
3. Optimizar imágenes (preload con `Asset`) y añadir splash adaptativo.
4. Sistema de notificaciones push para incidencias en tiempo real.

## Notas
- Los datos de hermandades se encuentran en `assets/data/hermandades-2025.json`.
- El alias `@mobile` resuelve a `./src` (configurado en `babel.config.js` y `tsconfig.json`).
- La versión web es un entorno de desarrollo/preview; la app está diseñada para **Android e iOS**.
