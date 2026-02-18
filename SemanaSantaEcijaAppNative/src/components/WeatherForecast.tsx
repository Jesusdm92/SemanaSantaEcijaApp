import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import { DayForecast, fetchWeatherForecast } from '../services/weatherService'

export default function WeatherForecast() {
    const [forecast, setForecast] = useState<DayForecast[] | null>(null)
    const [error, setError] = useState(false)

    useEffect(() => {
        let cancelled = false
        fetchWeatherForecast()
            .then(data => { if (!cancelled) setForecast(data) })
            .catch(() => { if (!cancelled) setError(true) })
        return () => { cancelled = true }
    }, [])

    if (error) {
        return (
            <View style={styles.wrapper}>
                <Text style={styles.errorText}>⚠️ No se pudo cargar la previsión</Text>
            </View>
        )
    }

    if (!forecast) {
        return (
            <View style={[styles.wrapper, styles.loadingWrapper]}>
                <ActivityIndicator size="small" color="#6a1b9a" />
                <Text style={styles.loadingText}>Cargando previsión…</Text>
            </View>
        )
    }

    // Detectar si hoy es el primer día para marcarlo visualmente
    const todayISO = new Date().toISOString().slice(0, 10)

    return (
        <View style={styles.wrapper}>
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>🌤️ Previsión Écija — 7 días</Text>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {forecast.map(day => {
                    const isToday = day.date === todayISO
                    return (
                        <View
                            key={day.date}
                            style={[styles.card, isToday && styles.cardToday]}
                        >
                            {/* Día */}
                            <Text style={[styles.dayName, isToday && styles.dayNameToday]}>
                                {isToday ? 'Hoy' : day.dayName}
                            </Text>

                            {/* Emoji del clima */}
                            <Text style={styles.emoji}>{day.weatherEmoji}</Text>

                            {/* Label del clima */}
                            <Text style={styles.weatherLabel} numberOfLines={1}>
                                {day.weatherLabel}
                            </Text>

                            {/* Temperaturas */}
                            <View style={styles.tempRow}>
                                <Text style={styles.tempMax}>{day.tempMax}°</Text>
                                <Text style={styles.tempSep}>/</Text>
                                <Text style={styles.tempMin}>{day.tempMin}°</Text>
                            </View>

                            {/* Probabilidad de lluvia */}
                            {day.precipProb > 0 ? (
                                <View style={styles.rainRow}>
                                    <Text style={styles.rainIcon}>💧</Text>
                                    <Text style={styles.rainText}>{day.precipProb}%</Text>
                                </View>
                            ) : (
                                <View style={styles.rainRow}>
                                    <Text style={styles.noRainText}>Sin lluvia</Text>
                                </View>
                            )}
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        paddingTop: 12,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ede7f6',
    },
    loadingWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    loadingText: {
        fontSize: 13,
        color: '#999',
    },
    errorText: {
        fontSize: 13,
        color: '#999',
        textAlign: 'center',
        paddingVertical: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6a1b9a',
        letterSpacing: 0.3,
    },
    scrollContent: {
        paddingHorizontal: 12,
        gap: 8,
    },
    // --- Card ---
    card: {
        width: 88,
        backgroundColor: '#faf8ff',
        borderRadius: 14,
        paddingVertical: 10,
        paddingHorizontal: 6,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ede7f6',
    },
    cardToday: {
        backgroundColor: '#ede7f6',
        borderColor: '#6a1b9a',
        borderWidth: 2,
    },
    dayName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#555',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    dayNameToday: {
        color: '#6a1b9a',
    },
    emoji: {
        fontSize: 28,
        marginBottom: 2,
    },
    weatherLabel: {
        fontSize: 10,
        color: '#777',
        marginBottom: 6,
        textAlign: 'center',
    },
    tempRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    tempMax: {
        fontSize: 15,
        fontWeight: '800',
        color: '#e65100',
    },
    tempSep: {
        fontSize: 12,
        color: '#bbb',
        marginHorizontal: 2,
    },
    tempMin: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1565c0',
    },
    rainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        minHeight: 16,
    },
    rainIcon: {
        fontSize: 11,
    },
    rainText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#1565c0',
    },
    noRainText: {
        fontSize: 10,
        color: '#aaa',
    },
})
