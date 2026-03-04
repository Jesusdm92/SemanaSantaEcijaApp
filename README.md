# SemanaSantaEcijaApp

Aplicación web desarrollada en **React 18** con **TypeScript** y **Bootstrap 5**, diseñada para mostrar los itinerarios, hermandades e información de la Semana Santa de Écija.

## 🎯 Objetivo
Proporcionar a los usuarios información clara y atractiva sobre las hermandades:
- Horarios de entrada y salida.
- Itinerarios completos por las calles.
- Escudos, imágenes y descripciones.
- Mapas interactivos con las rutas procesionales.
- Posibilidad de marcar hermandades como favoritas.

## ⚙️ Requisitos principales
- **Splash Screen** al inicio con el cartel oficial y un botón “Entrar” con animación de transición.
- **JSON de hermandades** (`public/data/hermandades.json`) con campos:
  - `id`, `name`, `day`, `entryTime`, `exitTime`, `shieldUrl`, `mainImage`, `itinerary[]`, `description`, `colors[]`, `music`, `isFavorite`.
- **Gestión de datos** con React Context o custom hook (`useHermandades`):
  - `getHermandades()`, `getHermandadById(id)`, `toggleFavorite(id)`.
  - Guardar favoritos en `localStorage`.

## 🧩 Componentes
- `SplashScreen`: muestra cartel e inicia transición.
- `Navbar`: navegación entre vistas (hermandades, favoritos, acerca de).
- `HermandadesList`: listado de hermandades con tarjetas elegantes.
- `HermandadDetail`: detalle con escudo grande, horarios, descripción, itinerario, imágenes y **mapa con recorrido** (Google Maps o Leaflet).
- `Favoritos`: listado de hermandades favoritas.
- `ItineraryMap`: componente para mostrar el mapa interactivo con la ruta.

## 🗺️ Routing
- `/` → SplashScreen
- `/hermandades` → Lista de hermandades
- `/hermandades/:id` → Detalle de hermandad
- `/favoritos` → Favoritos
- `/about` → Información general

## 🎨 Estilo
- Bootstrap 5 con una paleta inspirada en la Semana Santa:
  - Morado, dorado, negro, blanco.
- Tarjetas con bordes redondeados, sombras suaves y tipografía elegante.
- Responsive y accesible.
- Animaciones suaves en transiciones y botones.

## 🚀 Objetivo final
Una aplicación profesional y responsive que muestre toda la información de la Semana Santa de Écija con una experiencia moderna y cuidada.
