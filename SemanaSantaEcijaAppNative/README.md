# SemanaSantaEcijaApp (React Native / Expo)

Proyecto móvil (Expo + React Native) derivado de la versión web (Vite + React 18). Permite reutilizar datos y lógica para ofrecer una experiencia nativa.

## Tecnologías
- Expo SDK 54
- React Native 0.81 / React 19
- React Navigation (stack + bottom tabs)
- AsyncStorage (favoritos)
- TypeScript

## Estructura
```
SemanaSantaEcijaAppNative/
  assets/
    data/hermandades-2025.json
  src/
    context/HermandadesContext.tsx
    types/
      hermandad.ts
      navigation.ts
      incidencias.ts
    theme/colors.ts
    components/
      HermandadCard.tsx
      AlertBanner.tsx          # Banner de incidencias en tiempo real
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
1. Integrar modo oscuro (usar `Appearance` / `useColorScheme`).
2. Optimizar imágenes (preload con `Asset`) y añadir splash adaptativo.
3. Sistema de notificaciones push para incidencias en tiempo real.

## Notas
- Los datos de hermandades se encuentran en `assets/data/hermandades-2025.json`.
- El alias `@mobile` resuelve a `./src` (configurado en `babel.config.js` y `tsconfig.json`).
- La versión web es un entorno de desarrollo/preview; la app está diseñada para **Android e iOS**.
