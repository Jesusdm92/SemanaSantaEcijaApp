import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { IncidenciaType } from '../types/incidencias'

interface AlertBannerProps {
    type: IncidenciaType
    title: string
    message: string
}

export default function AlertBanner({ type, title, message }: AlertBannerProps) {
    const getColors = () => {
        switch (type) {
            case 'danger': return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '#dc2626' }
            case 'warning': return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '#d97706' }
            case 'info': default: return { bg: '#eff6ff', border: '#3b82f6', text: '#1e40af', icon: '#2563eb' }
        }
    }

    const colors = getColors()

    return (
        <View style={[styles.container, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <View style={styles.iconContainer}>
                <Ionicons name="warning" size={24} color={colors.icon} />
            </View>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    iconContainer: {
        marginRight: 12,
        justifyContent: 'center',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    message: {
        fontSize: 14,
        lineHeight: 18,
    },
})
