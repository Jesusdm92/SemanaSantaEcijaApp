# Diccionario de IDs: Hermandades de Écija

Este documento contiene los identificadores únicos (IDs) de cada hermandad. Estos IDs son los que debes usar en los comandos de n8n para que las alertas lleguen a la hermandad correcta en la App.

| Día | Hermandad | ID para n8n |
| :--- | :--- | :--- |
| **Domingo de Ramos** | Amor (El Olivo) | `75910` |
| **Domingo de Ramos** | Borriquita | `26978` |
| **Domingo de Ramos** | Cautivo y Lágrimas | `57188` |
| **Lunes Santo** | Yedra | `68445` |
| **Martes Santo** | Expiración | `1277` |
| **Miércoles Santo** | San Gil | `78066` |
| **Jueves Santo** | Confalón | `27120` |
| **Jueves Santo** | La Sangre | `64425` |
| **Viernes Santo** | Mortaja | `88787` |
| **Viernes Santo** | Piedad | `83972` |
| **Viernes Santo** | San Juan | `47463` |
| **Viernes Santo** | Silencio | `34963` |
| **Viernes Santo** | Sin Soga | `77415` |
| **Sábado Santo** | Soledad | `43437` |
| **Domingo de Resurrección** | Resucitado | `9329` |

---

### Cómo usar estos IDs en n8n
Cuando configures tu flujo de n8n, puedes crear un nodo (como un "Switch" o un "Dictionary") que traduzca el nombre que tú escribas en Telegram al ID numérico correspondiente.

**Ejemplo de comando en Telegram:**
`/aviso yedra Retraso de 15 minutos`

**Acción interna de n8n:**
1. Recibe "yedra".
2. Busca en la tabla: "yedra" -> `68445`.
3. Escribe en el Gist: `alerts["68445"] = { ... }`.
