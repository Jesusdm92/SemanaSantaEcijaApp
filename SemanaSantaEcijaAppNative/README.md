# SemanaSantaEcijaApp (React Native / Expo)

Proyecto móvil (Expo + React Native) derivado de la versión web (Vite + React 18). Permite reutilizar datos y lógica para ofrecer una experiencia nativa.

## Tecnologías
- Expo SDK 51
- React Native 0.73 / React 18
- React Navigation (stack)
- AsyncStorage (favoritos)
- TypeScript

## Estructura
```
SemanaSantaEcijaAppNative/
  assets/
    data/hermandades.json
  src/
    context/HermandadesContext.tsx
    types/hermandad.ts
    theme/colors.ts
    components/HermandadCard.tsx
    screens/
      SplashScreen.tsx
      HermandadesList.tsx
      HermandadDetail.tsx
      Favoritos.tsx
      About.tsx
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
|--------------------|-----------------------------|-------------------------------------|
| Router              | react-router-dom            | react-navigation (stack)             |
| Estado favoritos    | localStorage                | AsyncStorage                         |
| Mapas               | Leaflet                     | react-native-maps (polyline demo)    |
| UI / Layout         | Bootstrap + CSS             | Flexbox + StyleSheet                 |
| Icons               | Bootstrap Icons             | @expo/vector-icons (Ionicons)        |
| Assets estáticos    | public/                     | assets/                              |
| Placeholder imágenes| N/A                         | require('../../assets/placeholder')  |

## Próximos pasos
1. Instalar dependencias (si no se hizo) y ejecutar en dispositivo/emulador.
2. Sustituir coordenadas sintéticas por datos reales (geocodificación o backend).
3. Añadir Bottom Tabs (Lista / Favoritos / About) para navegación más rápida.
4. Integrar modo oscuro (usar Appearance / useColorScheme).
5. Optimizar imágenes (preload con Asset) y añadir splash adaptativo.

## Notas
Los errores de import (módulos RN) desaparecerán al instalar dependencias (actualmente solo archivos creados). Copia también imágenes necesarias a `assets/images/...`.
