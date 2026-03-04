/**
 * Cálculo dinámico de las fechas de Semana Santa.
 * Portado desde la app nativa (SemanaSantaEcijaAppNative/src/screens/HoySale.tsx).
 *
 * Usa el Algoritmo Anónimo Gregoriano para calcular el Domingo de Resurrección
 * de cualquier año, sin necesidad de librerías externas.
 */

/**
 * Devuelve la fecha del Domingo de Resurrección para el año dado.
 */
export function getEasterDate(year: number): Date {
    const f = Math.floor
    const G = year % 19
    const C = f(year / 100)
    const H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30
    const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11))
    const J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7
    const L = I - J
    const month = 3 + f((L + 40) / 44)
    const day = L + 28 - 31 * f(month / 4)
    return new Date(year, month - 1, day)
}

/**
 * Devuelve el nombre del día de Semana Santa para una fecha dada,
 * o null si no es Semana Santa.
 *
 * -7 = Domingo de Ramos, -6 = Lunes Santo, … 0 = Domingo de Resurrección
 */
export function getHolyWeekDay(date: Date): string | null {
    const year = date.getFullYear()
    const easter = getEasterDate(year)

    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    const easterDate = new Date(easter)
    easterDate.setHours(0, 0, 0, 0)

    const diffMs = checkDate.getTime() - easterDate.getTime()
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

    switch (diffDays) {
        case -7: return 'Domingo de Ramos'
        case -6: return 'Lunes Santo'
        case -5: return 'Martes Santo'
        case -4: return 'Miércoles Santo'
        case -3: return 'Jueves Santo'
        case -2: return 'Viernes Santo'
        case -1: return 'Sábado Santo'
        case 0: return 'Domingo de Resurrección'
        default: return null
    }
}

/**
 * Número de días que faltan para el Domingo de Ramos del año dado.
 * Negativo si ya pasó.
 */
export function daysUntilPalmSunday(date: Date): number {
    const year = date.getFullYear()
    const easter = getEasterDate(year)

    const todayZero = new Date(date)
    todayZero.setHours(0, 0, 0, 0)

    const palmSunday = new Date(easter)
    palmSunday.setDate(palmSunday.getDate() - 7)
    palmSunday.setHours(0, 0, 0, 0)

    const diffMs = palmSunday.getTime() - todayZero.getTime()
    return Math.round(diffMs / (1000 * 60 * 60 * 24))
}
