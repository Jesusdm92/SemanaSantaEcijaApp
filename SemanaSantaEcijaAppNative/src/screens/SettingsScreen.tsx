import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Switch, TouchableOpacity, Alert, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../theme/colors'
import { useNotificationPreferences, NotificationPrefs } from '../hooks/useNotificationPreferences'
import { sendLocalNotification, registerForNotifications } from '../services/notificationService'

interface SettingRow {
    key: keyof NotificationPrefs
    label: string
    description: string
    icon: string
    color: string
}

const SETTINGS: SettingRow[] = [
    {
        key: 'danger',
        label: 'Avisos críticos',
        description: 'Suspensiones, emergencias y alertas graves.',
        icon: 'alert-circle',
        color: '#dc2626',
    },
    {
        key: 'warning',
        label: 'Avisos generales',
        description: 'Retrasos, cambios de itinerario o modificaciones.',
        icon: 'warning',
        color: '#d97706',
    },
    {
        key: 'info',
        label: 'Información',
        description: 'Novedades y datos informativos.',
        icon: 'information-circle',
        color: '#2563eb',
    },
    {
        key: 'global',
        label: 'Avisos globales',
        description: 'Alertas que afectan a todas las hermandades.',
        icon: 'globe',
        color: '#7c3aed',
    },
]

export default function NotificationSettings() {
    const { prefs, togglePref, isLoading } = useNotificationPreferences()
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null)

    const handleToggle = async (key: keyof NotificationPrefs) => {
        // Si intenta activar, verificar permisos primero
        if (!prefs[key]) {
            const granted = await registerForNotifications()
            setPermissionGranted(granted)
            if (!granted) {
                Alert.alert(
                    'Permisos necesarios',
                    'Para recibir notificaciones, activa los permisos en los ajustes de tu dispositivo.',
                    [{ text: 'Entendido' }]
                )
                return
            }
        }
        togglePref(key)
    }

    const handleTest = async () => {
        const granted = await registerForNotifications()
        setPermissionGranted(granted)
        if (!granted) {
            Alert.alert(
                'Permisos necesarios',
                'Para recibir notificaciones, activa los permisos en los ajustes de tu dispositivo.',
                [{ text: 'Entendido' }]
            )
            return
        }
        await sendLocalNotification(
            '🔔 Prueba de notificación',
            'Si ves esto, las notificaciones funcionan correctamente.',
            { test: true }
        )
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe}>
                <Text style={styles.loadingText}>Cargando ajustes…</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.headerCard}>
                    <View style={styles.headerIconWrap}>
                        <Ionicons name="notifications" size={32} color={colors.secondary} />
                    </View>
                    <Text style={styles.headerTitle}>Notificaciones</Text>
                    <Text style={styles.headerSubtitle}>
                        Elige qué tipo de alertas quieres recibir en tu dispositivo. Las notificaciones se activan en tiempo real cuando se publica un aviso.
                    </Text>
                </View>

                {/* Settings cards */}
                {SETTINGS.map((setting) => (
                    <View key={setting.key} style={styles.card}>
                        <View style={styles.cardRow}>
                            <View style={[styles.iconCircle, { backgroundColor: `${setting.color}15` }]}>
                                <Ionicons name={setting.icon as any} size={22} color={setting.color} />
                            </View>
                            <View style={styles.cardTextWrap}>
                                <Text style={styles.cardLabel}>{setting.label}</Text>
                                <Text style={styles.cardDescription}>{setting.description}</Text>
                            </View>
                            <Switch
                                value={prefs[setting.key]}
                                onValueChange={() => handleToggle(setting.key)}
                                trackColor={{ false: '#e2e2e8', true: `${setting.color}80` }}
                                thumbColor={prefs[setting.key] ? setting.color : '#ccc'}
                                ios_backgroundColor="#e2e2e8"
                            />
                        </View>
                    </View>
                ))}

                {/* Test button */}
                <TouchableOpacity style={styles.testButton} onPress={handleTest} activeOpacity={0.8}>
                    <Ionicons name="notifications-outline" size={18} color="#fff" />
                    <Text style={styles.testButtonText}>Probar notificación</Text>
                </TouchableOpacity>

                {permissionGranted === false && (
                    <View style={styles.warningBanner}>
                        <Ionicons name="alert-circle-outline" size={18} color="#92400e" />
                        <Text style={styles.warningText}>
                            Los permisos de notificación no están concedidos. Actívalos en los ajustes de tu dispositivo.
                        </Text>
                    </View>
                )}

                <Text style={styles.disclaimer}>
                    Las notificaciones push se reciben en tiempo real, incluso con la app cerrada. Tus preferencias se sincronizan automáticamente.
                </Text>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 48,
    },
    loadingText: {
        padding: 16,
        color: colors.muted,
    },
    headerCard: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    headerIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#fef3c7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 6,
    },
    headerSubtitle: {
        fontSize: 13,
        color: colors.muted,
        textAlign: 'center',
        lineHeight: 19,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    cardTextWrap: {
        flex: 1,
        marginRight: 12,
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textDark,
        marginBottom: 2,
    },
    cardDescription: {
        fontSize: 12,
        color: colors.muted,
        lineHeight: 16,
    },
    testButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 14,
        marginTop: 8,
        marginBottom: 16,
    },
    testButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    warningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fef3c7',
        padding: 12,
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#f59e0b',
        marginBottom: 16,
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: '#92400e',
        lineHeight: 18,
    },
    disclaimer: {
        fontSize: 11,
        color: colors.muted,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 16,
    },
})
