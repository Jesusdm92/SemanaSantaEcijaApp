import { useState, useEffect, useCallback, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as FileSystem from 'expo-file-system/legacy'
import * as ImagePicker from 'expo-image-picker'
import * as MediaLibrary from 'expo-media-library'
import { Alert, Platform } from 'react-native'

const PRIVACY_KEY = '@gallery_privacy_shown'
const GALLERY_PREFIX = '@gallery_'

/**
 * Directorio base para fotos de la galería personal.
 * Dentro se crean subdirectorios por hermandadId.
 */
const getGalleryDir = (hermandadId: number) =>
    `${FileSystem.documentDirectory}gallery/${hermandadId}/`

/**
 * Hook personalizado para manejar la galería local de fotos de una hermandad.
 *
 * - Persiste las rutas en AsyncStorage (key: @gallery_{id}).
 * - Copia las imágenes al directorio de documentos de la app para permanencia.
 * - Muestra un aviso de privacidad la primera vez que el usuario añade una foto.
 */
export function useLocalPhotos(hermandadId: number) {
    const [photos, setPhotos] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    const storageKey = `${GALLERY_PREFIX}${hermandadId}`
    const storageKeyRef = useRef(storageKey)
    storageKeyRef.current = storageKey

    // ────────────────────────── LOAD ──────────────────────────
    const loadPhotos = useCallback(async () => {
        try {
            const raw = await AsyncStorage.getItem(storageKey)
            if (raw) {
                const parsed: string[] = JSON.parse(raw)
                if (Platform.OS === 'web') {
                    // En web no tenemos FileSystem, aceptamos todas las URIs
                    setPhotos(parsed)
                } else {
                    // Filtrar fotos que ya no existan en disco
                    const existing: string[] = []
                    for (const uri of parsed) {
                        const info = await FileSystem.getInfoAsync(uri)
                        if (info.exists) existing.push(uri)
                    }
                    setPhotos(existing)
                    // Sincronizar si se eliminaron huérfanas
                    if (existing.length !== parsed.length) {
                        await AsyncStorage.setItem(storageKey, JSON.stringify(existing))
                    }
                }
            }
        } catch (e) {
            console.warn('[useLocalPhotos] Error loading photos:', e)
        } finally {
            setLoading(false)
        }
    }, [storageKey])

    useEffect(() => {
        loadPhotos()
    }, [loadPhotos])

    // ────────────────────────── SAVE ──────────────────────────
    const persistPhoto = useCallback(
        async (sourceUri: string): Promise<string | null> => {
            try {
                let finalUri: string

                if (Platform.OS === 'web') {
                    // En web, las blob URLs son efímeras. Convertimos a data URL (base64)
                    // para que persistan en AsyncStorage entre sesiones.
                    finalUri = sourceUri
                    try {
                        const response = await fetch(sourceUri)
                        const blob = await response.blob()
                        finalUri = await new Promise<string>((resolve, reject) => {
                            const reader = new FileReader()
                            reader.onloadend = () => resolve(reader.result as string)
                            reader.onerror = reject
                            reader.readAsDataURL(blob)
                        })
                    } catch (convErr) {
                        console.warn('[useLocalPhotos] Could not convert blob to data URL:', convErr)
                    }
                } else {
                    const dir = getGalleryDir(hermandadId)
                    const dirInfo = await FileSystem.getInfoAsync(dir)
                    if (!dirInfo.exists) {
                        await FileSystem.makeDirectoryAsync(dir, { intermediates: true })
                    }

                    const filename = `photo_${Date.now()}.jpg`
                    finalUri = `${dir}${filename}`
                    await FileSystem.copyAsync({ from: sourceUri, to: finalUri })
                }

                // Functional setState: evita stale closures si se añaden fotos rápido
                setPhotos((prev) => {
                    const updated = [...prev, finalUri]
                    AsyncStorage.setItem(storageKeyRef.current, JSON.stringify(updated))
                    return updated
                })

                return finalUri
            } catch (e) {
                console.warn('[useLocalPhotos] Error saving photo:', e)
                Alert.alert('Error', 'No se pudo guardar la foto.')
                return null
            }
        },
        [hermandadId]
    )

    // ────────────────────────── DELETE ──────────────────────────
    const deletePhoto = useCallback(
        async (uri: string) => {
            try {
                if (Platform.OS !== 'web') {
                    await FileSystem.deleteAsync(uri, { idempotent: true })
                }
                setPhotos((prev) => {
                    const updated = prev.filter((p) => p !== uri)
                    AsyncStorage.setItem(storageKeyRef.current, JSON.stringify(updated))
                    return updated
                })
            } catch (e) {
                console.warn('[useLocalPhotos] Error deleting photo:', e)
            }
        },
        []
    )

    // ────────────────────────── DELETE MULTIPLE ──────────────────────────
    const deleteMultiple = useCallback(
        async (uris: Set<string>): Promise<number> => {
            try {
                const count = uris.size
                if (Platform.OS !== 'web') {
                    await Promise.all(
                        Array.from(uris).map((uri) =>
                            FileSystem.deleteAsync(uri, { idempotent: true })
                        )
                    )
                }
                setPhotos((prev) => {
                    const updated = prev.filter((p) => !uris.has(p))
                    AsyncStorage.setItem(storageKeyRef.current, JSON.stringify(updated))
                    return updated
                })
                return count
            } catch (e) {
                console.warn('[useLocalPhotos] Error deleting multiple photos:', e)
                return 0
            }
        },
        []
    )

    // ────────────────────── PRIVACY GUARD ──────────────────────
    const ensurePrivacyShown = useCallback(async (): Promise<boolean> => {
        const shown = await AsyncStorage.getItem(PRIVACY_KEY)
        if (shown) return true

        if (Platform.OS === 'web') {
            // En web, window.confirm funciona correctamente
            const accepted = window.confirm(
                'Tu privacidad importa\n\nTus fotos se guardan exclusivamente en este dispositivo y no se suben a ningún servidor externo.'
            )
            if (accepted) {
                await AsyncStorage.setItem(PRIVACY_KEY, 'true')
            }
            return accepted
        }

        return new Promise((resolve) => {
            Alert.alert(
                'Tu privacidad importa',
                'Tus fotos se guardan exclusivamente en este dispositivo y no se suben a ningún servidor externo.',
                [
                    {
                        text: 'Entendido',
                        onPress: async () => {
                            await AsyncStorage.setItem(PRIVACY_KEY, 'true')
                            resolve(true)
                        },
                    },
                ],
                { cancelable: false }
            )
        })
    }, [])

    // ────────────────────── PICK IMAGE ──────────────────────
    const pickImage = useCallback(
        async (source: 'camera' | 'library') => {
            // Mostrar aviso de privacidad si es la primera vez
            const ok = await ensurePrivacyShown()
            if (!ok) return

            let result: ImagePicker.ImagePickerResult

            if (source === 'camera') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync()
                if (status !== 'granted') {
                    Alert.alert(
                        'Permiso necesario',
                        'Necesitamos acceso a la cámara para tomar fotos.'
                    )
                    return
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ['images'],
                    quality: 0.8,
                })
            } else {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync()
                if (status !== 'granted') {
                    Alert.alert(
                        'Permiso necesario',
                        'Necesitamos acceso a tu galería para seleccionar fotos.'
                    )
                    return
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    quality: 0.8,
                })
            }

            if (!result.canceled && result.assets?.[0]?.uri) {
                const pickedUri = result.assets[0].uri

                // Si la foto fue tomada con la cámara, guardarla también en la galería del teléfono
                if (source === 'camera' && Platform.OS !== 'web') {
                    try {
                        const { status: mediaStatus } = await MediaLibrary.getPermissionsAsync()

                        if (mediaStatus === 'granted') {
                            // Ya tenemos permiso, guardar directamente
                            await MediaLibrary.saveToLibraryAsync(pickedUri)
                        } else if (mediaStatus !== 'denied') {
                            // Primera vez: explicar por qué pedimos el permiso
                            const userAccepted = await new Promise<boolean>((resolve) => {
                                Alert.alert(
                                    'Guardar en tu galería',
                                    'Para que no pierdas tus fotos si desinstalas la app o cambias de teléfono, podemos guardar una copia en la galería de tu dispositivo.\n\n¿Nos das permiso?',
                                    [
                                        {
                                            text: 'No, gracias',
                                            style: 'cancel',
                                            onPress: () => resolve(false),
                                        },
                                        {
                                            text: 'Sí, guardar',
                                            onPress: () => resolve(true),
                                        },
                                    ]
                                )
                            })

                            if (userAccepted) {
                                const { status: newStatus } = await MediaLibrary.requestPermissionsAsync()
                                if (newStatus === 'granted') {
                                    await MediaLibrary.saveToLibraryAsync(pickedUri)
                                }
                            }
                        }
                        // Si status === 'denied', no volvemos a molestar
                    } catch (saveErr) {
                        console.warn('[useLocalPhotos] Could not save to device gallery:', saveErr)
                        // No bloqueamos el flujo — la foto se guarda igualmente en la app
                    }
                }

                await persistPhoto(pickedUri)
            }
        },
        [ensurePrivacyShown, persistPhoto]
    )

    // ────────────────────── ADD PHOTO ──────────────────────
    const showAddPhotoOptions = useCallback(() => {
        if (Platform.OS === 'web') {
            // En web no hay cámara, ir directamente a galería
            pickImage('library')
            return
        }
        Alert.alert('Añadir foto', 'Elige una opción', [
            { text: 'Cámara', onPress: () => pickImage('camera') },
            { text: 'Galería', onPress: () => pickImage('library') },
            { text: 'Cancelar', style: 'cancel' },
        ])
    }, [pickImage])

    return {
        photos,
        loading,
        deletePhoto,
        deleteMultiple,
        showAddPhotoOptions,
        pickImage,
        refresh: loadPhotos,
    }
}
