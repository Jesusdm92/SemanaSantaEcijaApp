# Proyecto: Semana Santa Écija (Resumen de contexto para prompts y desarrollo)

Este archivo reúne la información clave del proyecto para ayudar a futuros prompts, desarrollos y debugging rápido. Guarda aquí decisiones arquitectónicas, scripts útiles, rutas importantes y tips de Expo/Metro para evitar repetir la misma búsqueda.

---

## 1. Propósito
Aplicación (web + nativo) para mostrar la Semana Santa de Écija con listas de hermandades, detalles (pasos, itinerarios), mapas, favoritos y filtros por día y año (2025 actualmente).

## 2. Estructura del workspace (puntos relevantes)
- Root:
  - `index.html`, `package.json`, `vite.config.ts` — web Vite app
  - `public/` — recursos para web
  - `data/` — datos canónicos (tools) y artefactos
  - `SemanaSantaEcijaAppNative/` — app Expo (nativa)
- Dentro de `SemanaSantaEcijaAppNative/`:
  - `App.tsx`, `app.json`, `package.json`, `tsconfig.json` — configuración Expo
  - `assets/` — iconos, splash, `images/escudos/` (15 PNGs)
  - `src/screens/` — pantallas nativas (HermandadDetail.tsx, etc.)
  - `src/utils/escudos.ts` — helper que mapea nombres de escudos a `require()` (necesario para RN)
  - `src/context/HermandadesContext.tsx` — carga y gestión de hermandades

## 3. Datos y generación
- Canonical source: `tools/data/itinerarios-2025.json` (contiene `escudoURL`, `titulo_completo`, `ano_fundacion`, `web_oficial`, `pasos[]`, `itinerario`, `horarios`, etc.)
- Generador: `tools/build-hermandades-2025.mjs` que descarga escudos, mapea campos y genera `hermandades-2025.json` para web y native
- Outputs: `public/data/hermandades-2025.json` (web) y `SemanaSantaEcijaAppNative/assets/data/hermandades-2025.json` (native)

## 4. Assets
- Escudos: `public/assets/images/escudos/*.png` y `SemanaSantaEcijaAppNative/assets/images/escudos/*.png` (15 images)
- Placeholders: `public/assets/images/*.svg|.jpg` generadas por `tools/generate-placeholders.js`

## 5. Dependencias y versiones clave
- Web: React 18, Vite, TypeScript
- Native: Expo SDK 54 (actual), React Native 0.81.x
- Módulos claves: `expo-linear-gradient`, `react-navigation`, `@expo/vector-icons`, `expo-splash-screen`

## 6. Problemas conocidos y soluciones rápidas
- Shields no cargan en native: React Native no acepta `{ uri: '/assets/...' }` para assets locales. Solución: `src/utils/escudos.ts` con `require()` mappings y `getEscudoSource()`.
- Expo Go no refresca cambios en Windows: activar polling para chokidar o usar `npx expo start -c`, o lanzar con `--tunnel` si la red bloquea.
- Splash nativa puede quedarse activa: asegurar `expo-splash-screen` hide en `NavigationContainer.onReady` y añadir timeout guard.

## 7. Comandos útiles
- Iniciar Expo (native):
```powershell
cd "SemanaSantaEcijaAppNative"
npx expo start
```
- Forzar limpieza de caché Metro/Expo:
```powershell
npx expo start -c
```
- Forzar polling (solo esta sesión):
```powershell
$env:CHOKIDAR_USEPOLLING="1"
$env:CHOKIDAR_INTERVAL="150"
npx expo start -c
```
- Cambiar a tunnel si la red falla:
```powershell
npx expo start --tunnel
```
- Regenerar hermandades (script custom):
```powershell
node tools/build-hermandades-2025.mjs
```

## 8. Archivos y rutas importantes
- `SemanaSantaEcijaAppNative/src/screens/HermandadDetail.tsx` — detalle, UI de pasos, info y enlace web.
- `SemanaSantaEcijaAppNative/src/utils/escudos.ts` — mapping require para escudos.
- `tools/build-hermandades-2025.mjs` — script generador/download escudos.
- `public/data/hermandades-2025.json` — JSON usado por la web.

## 9. Tips para futuros prompts (plantilla)
Incluye siempre:
- Objetivo claro: (ej. "mejorar UX de pantalla X", "añadir API para datos")
- Alcance: archivos concretos a cambiar, plataforma (web/native)
- Comportamiento esperado y ejemplo de datos (un objeto hermandad de ejemplo)
- Prioridad: (UX rápido, bug crítico, performance)
- Comandos de verificación esperados: (ej. "npx expo start -c" y "abrir en Expo Go")

Plantilla mínima para prompts:
- "Quiero X en `ruta/archivo.tsx` — objetivo: Y — input: (ej JSON) — aceptar cambios visuales y añadir tests: sí/no".

## 10. Siguientes pasos sugeridos (opcionales)
- Añadir `PROJECT_CONTEXT.md` al README o docs/ y referenciar en PRs
- Crear script `npm run regen-data` que ejecute `node tools/build-hermandades-2025.mjs`
- Añadir CI que valide que `SemanaSantaEcijaAppNative/assets/images/escudos` contiene las 15 imágenes requeridas

---

Fecha: 2025-10-13
Creado por: asistencia automática para facilitar futuros prompts
