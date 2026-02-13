# Guía de Comandos: Bot de Telegram

Utiliza estos comandos en tu chat privado con el Bot para gestionar las incidencias en tiempo real. 

---

## 1. Alertas por Hermandad
Estos comandos activan un banner de color dentro de la ficha de una hermandad específica.

| Comando | Color en App | Uso sugerido | Ejemplo |
| :--- | :--- | :--- | :--- |
| `/aviso` | 🟨 Amarillo | Retrasos cortos, cambios de última hora. | `/aviso yedra Retraso de 15 min en salida` |
| `/peligro` | 🟥 Rojo | Suspensiones, lluvia, cambios graves. | `/peligro borriquita Salida suspendida por lluvia` |
| `/info` | 🟦 Azul | Estrenos, puntos de interés, avisos leves. | `/info sangil Estrena manto de camarín` |
| `/ok` | (Borra) | Quitar la alerta y volver a la normalidad. | `/ok yedra` |

> **Nota:** n8n debe estar configurado para entender tanto el nombre (ej: "yedra") como el ID (ej: "68445").

---

## 2. Alertas Globales
Estos comandos muestran un banner en la **parte superior de todas las pantallas** de la aplicación. Es ideal para avisos meteorológicos que afectan a toda la ciudad.

| Comando | Color en App | Ejemplo |
| :--- | :--- | :--- |
| `/global` | 🟧 Naranja | `/global ⚠️ Riesgo de lluvia alto para el resto del día.` |
| `/global_ok` | (Borra) | `/global_ok` |

---

## 3. Comandos de Control
| Comando | Acción |
| :--- | :--- |
| `/estado` | Te devuelve un resumen de qué alertas hay activas ahora mismo en el Gist. |
| `/ayuda` | Muestra esta lista de comandos en el chat de Telegram. |

---

## Consejos de uso

1.  **Nombres:** Al escribir el nombre de la hermandad, n8n suele estar configurado para ignorar mayúsculas/minúsculas, pero intenta que sea una sola palabra o el nombre clave (ej: `borriquita`, `sangil`, `olivo`).
2.  **Mensajes cortos:** Los banners en el móvil tienen espacio limitado. Intenta ser directo: *"Retraso 30 min"* es mejor que *"La hermandad ha decidido tras una reunión retrasar la salida unos 30 minutos..."*.
3.  **Confirmación:** Después de enviar un comando, el Bot te responderá con un mensaje como `"✅ Gist actualizado"`. Si no te responde, revisa si n8n está encendido.
