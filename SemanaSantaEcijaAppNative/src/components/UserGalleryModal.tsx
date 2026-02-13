import React, { useState, useCallback, useRef, useEffect, memo } from 'react'
import {
    View,
    Text,
    Modal,
    StyleSheet,
    Pressable,
    FlatList,
    Image,
    Alert,
    StatusBar,
    Platform,
    Animated,
    useWindowDimensions,
    AccessibilityInfo,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as Haptics from 'expo-haptics'
import { colors } from '@mobile/theme/colors'
import { useLocalPhotos } from '@mobile/hooks/useLocalPhotos'

// ────────────────────────── CONSTANTS ──────────────────────────
const GRID_GAP = 2
const NUM_COLUMNS = 3
const TOAST_DURATION = 2500

// ────────────────────────── SKELETON THUMB ──────────────────────────
const SkeletonThumb = memo(({ size }: { size: number }) => {
    const opacity = useRef(new Animated.Value(0.3)).current

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        )
        loop.start()
        return () => loop.stop()
    }, [opacity])

    return (
        <Animated.View
            style={[styles.skeletonThumb, { width: size, height: size, opacity }]}
            accessibilityLabel="Cargando imagen"
        >
            <Ionicons name="image-outline" size={24} color="rgba(75,0,130,0.15)" />
        </Animated.View>
    )
})

// ────────────────────────── PHOTO THUMBNAIL ──────────────────────────
interface PhotoThumbProps {
    uri: string
    size: number
    isSelecting: boolean
    isSelected: boolean
    onPress: (uri: string) => void
    onLongPress: (uri: string) => void
    onDelete: (uri: string) => void
}

const PhotoThumb = memo(({ uri, size, isSelecting, isSelected, onPress, onLongPress, onDelete }: PhotoThumbProps) => {
    const [loaded, setLoaded] = useState(false)

    return (
        <Pressable
            onPress={() => onPress(uri)}
            onLongPress={() => onLongPress(uri)}
            style={({ pressed }) => [
                styles.thumbContainer,
                { width: size, height: size },
                pressed && styles.thumbPressed,
                isSelected && styles.thumbSelected,
            ]}
            accessibilityRole={isSelecting ? 'checkbox' : 'button'}
            accessibilityState={isSelecting ? { checked: isSelected } : undefined}
            accessibilityLabel={isSelecting
                ? `Foto${isSelected ? ', seleccionada' : ''}`
                : 'Abrir foto'
            }
        >
            {/* Skeleton shimmer while loading */}
            {!loaded && (
                <View style={StyleSheet.absoluteFill}>
                    <SkeletonThumb size={size} />
                </View>
            )}
            <Image
                source={{ uri }}
                style={[styles.thumbImage, isSelected && styles.thumbImageSelected]}
                resizeMode="cover"
                onLoad={() => setLoaded(true)}
            />

            {/* Selection overlay / checkbox */}
            {isSelecting && (
                <View style={styles.thumbSelectOverlay}>
                    <View
                        style={[styles.thumbCheckbox, isSelected && styles.thumbCheckboxActive]}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: isSelected }}
                    >
                        {isSelected && (
                            <Ionicons name="checkmark" size={16} color="#fff" />
                        )}
                    </View>
                </View>
            )}

            {/* Delete badge — only in normal mode */}
            {!isSelecting && (
                <Pressable
                    onPress={() => onDelete(uri)}
                    style={({ pressed }) => [
                        styles.thumbDeleteBadge,
                        pressed && { opacity: 0.6, transform: [{ scale: 0.9 }] },
                    ]}
                    hitSlop={6}
                    accessibilityLabel="Eliminar foto"
                    accessibilityRole="button"
                >
                    <Ionicons name="close" size={14} color="#fff" />
                </Pressable>
            )}
        </Pressable>
    )
})

// ────────────────────────── TOAST COMPONENT ──────────────────────────
const Toast = memo(({ message, visible }: { message: string; visible: boolean }) => {
    const translateY = useRef(new Animated.Value(80)).current
    const opacity = useRef(new Animated.Value(0)).current

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, { toValue: 0, friction: 8, tension: 80, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]).start()
        } else {
            Animated.parallel([
                Animated.timing(translateY, { toValue: 80, duration: 250, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
            ]).start()
        }
    }, [visible, translateY, opacity])

    return (
        <Animated.View
            style={[
                styles.toast,
                { transform: [{ translateY }], opacity },
            ]}
            pointerEvents="none"
            accessibilityRole="alert"
            accessibilityLiveRegion="assertive"
        >
            <Ionicons name="checkmark-circle" size={18} color="#4ade80" />
            <Text style={styles.toastText}>{message}</Text>
        </Animated.View>
    )
})

// ────────────────────────── MAIN COMPONENT ──────────────────────────
interface UserGalleryModalProps {
    visible: boolean
    onClose: () => void
    hermandadId: number
    hermandadName?: string
}

export default function UserGalleryModal({
    visible,
    onClose,
    hermandadId,
    hermandadName,
}: UserGalleryModalProps) {
    const { photos, loading, deletePhoto, deleteMultiple, showAddPhotoOptions } =
        useLocalPhotos(hermandadId)

    // Dynamic dimensions (#4 fix)
    const { width: screenWidth, height: screenHeight } = useWindowDimensions()
    const thumbSize = (screenWidth - GRID_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS

    const [viewerUri, setViewerUri] = useState<string | null>(null)

    // ── Multi-select state ──
    const [selecting, setSelecting] = useState(false)
    const [selectedUris, setSelectedUris] = useState<Set<string>>(new Set())

    // ── Toast state ──
    const [toastMessage, setToastMessage] = useState('')
    const [toastVisible, setToastVisible] = useState(false)
    const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

    const showToast = useCallback((msg: string) => {
        if (toastTimeout.current) clearTimeout(toastTimeout.current)
        setToastMessage(msg)
        setToastVisible(true)
        toastTimeout.current = setTimeout(() => setToastVisible(false), TOAST_DURATION)
    }, [])

    // Reset selection when modal closes
    useEffect(() => {
        if (!visible) {
            setSelecting(false)
            setSelectedUris(new Set())
            setToastVisible(false)
        }
    }, [visible])

    // Cleanup toast timeout
    useEffect(() => {
        return () => {
            if (toastTimeout.current) clearTimeout(toastTimeout.current)
        }
    }, [])

    // FAB scale animation
    const fabScale = useRef(new Animated.Value(0)).current
    useEffect(() => {
        if (visible && !selecting) {
            Animated.spring(fabScale, {
                toValue: 1,
                friction: 5,
                tension: 80,
                useNativeDriver: true,
                delay: 300,
            }).start()
        } else {
            fabScale.setValue(0)
        }
    }, [visible, selecting, fabScale])

    // ────────────────────── SELECTION LOGIC ──────────────────────
    const enterSelectionMode = useCallback((firstUri?: string) => {
        // Haptic feedback (#10)
        if (Platform.OS !== 'web') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        }
        setSelecting(true)
        setSelectedUris(firstUri ? new Set([firstUri]) : new Set())
    }, [])

    const exitSelectionMode = useCallback(() => {
        setSelecting(false)
        setSelectedUris(new Set())
    }, [])

    const toggleSelection = useCallback((uri: string) => {
        // Light haptic on toggle
        if (Platform.OS !== 'web') {
            Haptics.selectionAsync()
        }
        setSelectedUris((prev) => {
            const next = new Set(prev)
            if (next.has(uri)) {
                next.delete(uri)
            } else {
                next.add(uri)
            }
            if (next.size === 0) {
                setSelecting(false)
            }
            return next
        })
    }, [])

    const selectAll = useCallback(() => {
        setSelectedUris(new Set(photos))
    }, [photos])

    // ────────────────────── DELETE SELECTED (BATCH) ──────────────────────
    const handleDeleteSelected = useCallback(() => {
        const count = selectedUris.size
        if (count === 0) return

        const msg = `¿Eliminar ${count} foto${count > 1 ? 's' : ''} de tu galería personal?\n\nSolo se eliminarán de esta app. Las fotos originales de tu dispositivo no se verán afectadas.`

        if (Platform.OS === 'web') {
            const ok = window.confirm(msg)
            if (ok) {
                deleteMultiple(selectedUris).then((n) => {
                    if (n > 0) showToast(`${n} foto${n > 1 ? 's' : ''} eliminada${n > 1 ? 's' : ''}`)
                })
                exitSelectionMode()
            }
            return
        }

        Alert.alert(
            `Eliminar ${count} foto${count > 1 ? 's' : ''}`,
            'Solo se eliminarán de esta app.\nLas fotos originales de tu dispositivo no se verán afectadas.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        deleteMultiple(selectedUris).then((n) => {
                            if (n > 0) showToast(`${n} foto${n > 1 ? 's' : ''} eliminada${n > 1 ? 's' : ''}`)
                        })
                        exitSelectionMode()
                    },
                },
            ]
        )
    }, [selectedUris, deleteMultiple, exitSelectionMode, showToast])

    // ────────────────────── DELETE SINGLE ──────────────────────
    const handleDeleteConfirm = useCallback(
        (uri: string) => {
            if (Platform.OS === 'web') {
                const ok = window.confirm(
                    '¿Eliminar esta foto de tu galería personal?\n\nSolo se eliminará de esta app. La foto original de tu dispositivo no se verá afectada.'
                )
                if (ok) {
                    deletePhoto(uri)
                    showToast('Foto eliminada')
                    if (viewerUri === uri) setViewerUri(null)
                }
                return
            }
            Alert.alert(
                'Eliminar de mi galería',
                'Solo se eliminará de esta app.\nLa foto original de tu dispositivo no se verá afectada.',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: () => {
                            deletePhoto(uri)
                            showToast('Foto eliminada')
                            if (viewerUri === uri) setViewerUri(null)
                        },
                    },
                ]
            )
        },
        [deletePhoto, viewerUri, showToast]
    )

    // ────────────────────── THUMB HANDLERS ──────────────────────
    const handleThumbPress = useCallback(
        (uri: string) => {
            if (selecting) {
                toggleSelection(uri)
            } else {
                setViewerUri(uri)
            }
        },
        [selecting, toggleSelection]
    )

    const handleThumbLongPress = useCallback(
        (uri: string) => {
            if (!selecting) {
                enterSelectionMode(uri)
            }
        },
        [selecting, enterSelectionMode]
    )

    // ────────────────────── RENDER: THUMBNAIL ──────────────────────
    const renderItem = useCallback(
        ({ item }: { item: string }) => (
            <PhotoThumb
                uri={item}
                size={thumbSize}
                isSelecting={selecting}
                isSelected={selectedUris.has(item)}
                onPress={handleThumbPress}
                onLongPress={handleThumbLongPress}
                onDelete={handleDeleteConfirm}
            />
        ),
        [thumbSize, selecting, selectedUris, handleThumbPress, handleThumbLongPress, handleDeleteConfirm]
    )

    const keyExtractor = useCallback((item: string) => item, [])

    // ────────────────────── RENDER: SKELETON GRID ──────────────────────
    const renderSkeletonGrid = () => (
        <View style={styles.skeletonGrid}>
            {Array.from({ length: 9 }).map((_, i) => (
                <SkeletonThumb key={`skel-${i}`} size={thumbSize} />
            ))}
        </View>
    )

    // ────────────────────── RENDER: EMPTY STATE ──────────────────────
    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyRingsOuter}>
                <View style={styles.emptyRingsMiddle}>
                    <LinearGradient
                        colors={['rgba(75, 0, 130, 0.06)', 'rgba(212, 175, 55, 0.1)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.emptyIconCircle}
                    >
                        <View style={styles.emptyIconInner}>
                            <Ionicons name="camera" size={40} color={colors.secondary} />
                        </View>
                    </LinearGradient>
                </View>
            </View>

            <Text style={styles.emptyTitle}>Tus recuerdos, aquí</Text>
            <Text style={styles.emptySubtitle}>
                Aún no tienes recuerdos de esta Hermandad.{'\n'}
                Pulsa el botón para añadir tu primera foto.
            </Text>

            <View style={styles.emptyFeatures}>
                <View style={styles.emptyFeaturePill}>
                    <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
                    <Text style={styles.emptyFeatureText}>Solo en tu dispositivo</Text>
                </View>
                <View style={styles.emptyFeaturePill}>
                    <Ionicons name="cloud-offline-outline" size={14} color={colors.primary} />
                    <Text style={styles.emptyFeatureText}>Sin conexión necesaria</Text>
                </View>
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.emptyAddButton,
                    pressed && styles.emptyAddButtonPressed,
                ]}
                onPress={showAddPhotoOptions}
                accessibilityRole="button"
                accessibilityLabel="Añadir primera foto"
            >
                <LinearGradient
                    colors={['#5a1a8a', '#4b0082']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.emptyAddButtonGradient}
                >
                    <Ionicons name="camera-outline" size={20} color="#fff" />
                    <Text style={styles.emptyAddButtonText}>Añadir primera foto</Text>
                </LinearGradient>
            </Pressable>
        </View>
    )

    // ────────────────────── RENDER: FULL-SCREEN SWIPE VIEWER (#11) ──────────────────────
    const renderViewer = () => {
        if (!viewerUri) return null
        const initialIndex = photos.indexOf(viewerUri)

        return (
            <Modal
                visible
                transparent
                animationType="fade"
                onRequestClose={() => setViewerUri(null)}
            >
                <View style={styles.viewerOverlay}>
                    <StatusBar barStyle="light-content" />

                    {/* Swipeable image list */}
                    <FlatList
                        data={photos}
                        horizontal
                        pagingEnabled
                        initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        getItemLayout={(_data, index) => ({
                            length: screenWidth,
                            offset: screenWidth * index,
                            index,
                        })}
                        onMomentumScrollEnd={(e) => {
                            const idx = Math.round(e.nativeEvent.contentOffset.x / screenWidth)
                            if (photos[idx]) setViewerUri(photos[idx])
                        }}
                        renderItem={({ item }) => (
                            <View style={{ width: screenWidth, height: screenHeight }}>
                                <Image
                                    source={{ uri: item }}
                                    style={{ width: screenWidth, height: screenHeight }}
                                    resizeMode="contain"
                                />
                            </View>
                        )}
                    />

                    {/* Gradient top */}
                    <LinearGradient
                        colors={['rgba(0,0,0,0.7)', 'transparent']}
                        style={styles.viewerGradientTop}
                    />

                    {/* Top bar */}
                    <View style={styles.viewerTopBar}>
                        <Pressable
                            onPress={() => setViewerUri(null)}
                            style={({ pressed }) => [
                                styles.viewerCloseBtn,
                                pressed && { opacity: 0.6 },
                            ]}
                            accessibilityLabel="Cerrar imagen"
                            accessibilityRole="button"
                        >
                            <Ionicons name="close" size={24} color="#fff" />
                        </Pressable>
                        <Text
                            style={styles.viewerCounter}
                            accessibilityRole="text"
                            accessibilityLabel={`Foto ${(photos.indexOf(viewerUri) + 1)} de ${photos.length}`}
                        >
                            {photos.indexOf(viewerUri) + 1} / {photos.length}
                        </Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Gradient bottom */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.viewerGradientBottom}
                    />

                    {/* Bottom bar — delete */}
                    <View style={styles.viewerBottomBar}>
                        <Pressable
                            onPress={() => handleDeleteConfirm(viewerUri)}
                            style={({ pressed }) => [
                                styles.viewerDeleteBtn,
                                pressed && { opacity: 0.6 },
                            ]}
                            accessibilityLabel="Eliminar foto de mi galería"
                            accessibilityRole="button"
                        >
                            <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                            <Text style={styles.viewerDeleteText}>Eliminar de mi galería</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        )
    }

    // ────────────────────── RENDER: SELECTION BAR ──────────────────────
    const renderSelectionBar = () => {
        if (!selecting) return null
        const count = selectedUris.size
        const allSelected = count === photos.length

        return (
            <View style={styles.selectionBar}>
                <LinearGradient
                    colors={['#1a0530', '#2a0a45']}
                    style={styles.selectionBarGradient}
                >
                    <Pressable
                        onPress={allSelected ? exitSelectionMode : selectAll}
                        style={({ pressed }) => [
                            styles.selectionBarBtn,
                            pressed && { opacity: 0.6 },
                        ]}
                        accessibilityRole="button"
                        accessibilityLabel={allSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}
                    >
                        <Ionicons
                            name={allSelected ? 'checkbox' : 'checkbox-outline'}
                            size={20}
                            color={colors.secondary}
                        />
                        <Text style={styles.selectionBarBtnText}>
                            {allSelected ? 'Deseleccionar' : 'Todas'}
                        </Text>
                    </Pressable>

                    <Text
                        style={styles.selectionBarCount}
                        accessibilityRole="text"
                        accessibilityLiveRegion="polite"
                    >
                        {count} seleccionada{count !== 1 ? 's' : ''}
                    </Text>

                    <Pressable
                        onPress={handleDeleteSelected}
                        style={({ pressed }) => [
                            styles.selectionBarDeleteBtn,
                            pressed && { opacity: 0.6 },
                            count === 0 && { opacity: 0.3 },
                        ]}
                        disabled={count === 0}
                        accessibilityRole="button"
                        accessibilityLabel={`Eliminar ${count} foto${count !== 1 ? 's' : ''} seleccionada${count !== 1 ? 's' : ''}`}
                    >
                        <Ionicons name="trash-outline" size={20} color="#ff6b6b" />
                        <Text style={styles.selectionBarDeleteText}>Eliminar</Text>
                    </Pressable>
                </LinearGradient>
            </View>
        )
    }

    // ────────────────────── MAIN RENDER ──────────────────────
    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={selecting ? exitSelectionMode : onClose}
            statusBarTranslucent
        >
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />

                {/* ─── Header ─── */}
                <LinearGradient
                    colors={selecting ? ['#2d0a0a', '#450d1a', '#5a0020'] : ['#1a0530', '#3a0d60', '#4b0082']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Pressable
                        onPress={selecting ? exitSelectionMode : onClose}
                        style={({ pressed }) => [
                            styles.headerBtn,
                            pressed && { opacity: 0.6 },
                        ]}
                        accessibilityLabel={selecting ? 'Cancelar selección' : 'Cerrar galería'}
                        accessibilityRole="button"
                    >
                        {selecting ? (
                            <Ionicons name="close" size={24} color={colors.textLight} />
                        ) : (
                            <Ionicons name="chevron-back" size={24} color={colors.textLight} />
                        )}
                    </Pressable>

                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>
                            {selecting ? 'Seleccionar fotos' : 'Mi Galería'}
                        </Text>
                        {!selecting && hermandadName && (
                            <Text style={styles.headerSubtitle} numberOfLines={1}>
                                {hermandadName}
                            </Text>
                        )}
                        {selecting && (
                            <Text style={styles.headerSubtitle}>
                                Mantén pulsada o toca para seleccionar
                            </Text>
                        )}
                    </View>

                    {/* Right header button — #3 fix: enter empty selection mode */}
                    {!selecting && photos.length > 0 && (
                        <Pressable
                            onPress={() => enterSelectionMode()}
                            style={({ pressed }) => [
                                styles.headerBtn,
                                pressed && { opacity: 0.6 },
                            ]}
                            accessibilityLabel="Seleccionar fotos"
                            accessibilityRole="button"
                        >
                            <Ionicons name="checkmark-circle-outline" size={24} color={colors.textLight} />
                        </Pressable>
                    )}
                    {!selecting && photos.length === 0 && <View style={{ width: 42 }} />}
                    {selecting && <View style={{ width: 42 }} />}
                </LinearGradient>

                {/* ─── Content ─── */}
                {loading ? (
                    renderSkeletonGrid()
                ) : photos.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <View style={styles.gridWrapper}>
                        <FlatList
                            data={photos}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            numColumns={NUM_COLUMNS}
                            contentContainerStyle={[
                                styles.gridContent,
                                selecting && { paddingBottom: 140 },
                            ]}
                            columnWrapperStyle={styles.gridRow}
                            showsVerticalScrollIndicator={false}
                            initialNumToRender={12}
                            maxToRenderPerBatch={9}
                            windowSize={5}
                            removeClippedSubviews={Platform.OS !== 'web'}
                            extraData={selecting ? selectedUris.size : 0}
                            getItemLayout={(_data, index) => ({
                                length: thumbSize + GRID_GAP,
                                offset: (thumbSize + GRID_GAP) * Math.floor(index / NUM_COLUMNS),
                                index,
                            })}
                        />

                        {/* Hint bar — only in normal mode */}
                        {!selecting && (
                            <View style={styles.hintBar}>
                                <View style={styles.hintPill}>
                                    <Ionicons name="finger-print-outline" size={13} color={colors.muted} />
                                    <Text style={styles.hintText}>Mantén pulsada una foto para seleccionar varias</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* ─── Selection Bottom Bar ─── */}
                {renderSelectionBar()}

                {/* ─── FAB (only in normal mode) ─── */}
                {!loading && photos.length > 0 && !selecting && (
                    <Animated.View
                        style={[
                            styles.fabContainer,
                            { transform: [{ scale: fabScale }] },
                        ]}
                    >
                        <Pressable
                            onPress={showAddPhotoOptions}
                            style={({ pressed }) => [
                                styles.fab,
                                pressed && styles.fabPressed,
                            ]}
                            accessibilityLabel="Añadir foto"
                            accessibilityRole="button"
                        >
                            <LinearGradient
                                colors={['#d4af37', '#c49b2f']}
                                style={styles.fabGradient}
                            >
                                <Ionicons name="camera" size={26} color="#fff" />
                            </LinearGradient>
                        </Pressable>
                    </Animated.View>
                )}

                {/* ─── Toast notification ─── */}
                <Toast message={toastMessage} visible={toastVisible} />

                {/* ─── Full-screen image viewer ─── */}
                {renderViewer()}
            </View>
        </Modal>
    )
}

// ────────────────────────── STYLES ──────────────────────────
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0d0d',
    },

    /* ── Header ── */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.select({ ios: 56, android: 46, default: 22 }),
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    headerBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 3,
        fontWeight: '400',
    },

    /* ── Skeleton Grid ── */
    skeletonGrid: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: GRID_GAP,
        paddingTop: GRID_GAP,
    },
    skeletonThumb: {
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ── Empty State ── */
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 44,
    },
    emptyRingsOuter: {
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    emptyRingsMiddle: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 1,
        borderColor: 'rgba(212,175,55,0.12)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyIconInner: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(212,175,55,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 10,
        letterSpacing: 0.3,
    },
    emptySubtitle: {
        fontSize: 14,
        lineHeight: 22,
        color: 'rgba(255,255,255,0.45)',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyFeatures: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    emptyFeaturePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(75,0,130,0.12)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(75,0,130,0.2)',
    },
    emptyFeatureText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.55)',
        fontWeight: '500',
    },
    emptyAddButton: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#4b0082',
        shadowOpacity: 0.5,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
    },
    emptyAddButtonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.97 }],
    },
    emptyAddButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 28,
        paddingVertical: 16,
    },
    emptyAddButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        letterSpacing: 0.3,
    },

    /* ── Grid ── */
    gridWrapper: {
        flex: 1,
    },
    gridContent: {
        paddingBottom: 100,
    },
    gridRow: {
        gap: GRID_GAP,
        marginBottom: GRID_GAP,
    },
    thumbContainer: {
        aspectRatio: 1,
        overflow: 'hidden',
        backgroundColor: '#1a1a1a',
    },
    thumbPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.97 }],
    },
    thumbSelected: {
        borderWidth: 3,
        borderColor: colors.secondary,
    },
    thumbImage: {
        width: '100%',
        height: '100%',
    },
    thumbImageSelected: {
        opacity: 0.75,
    },
    thumbDeleteBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    thumbSelectOverlay: {
        position: 'absolute',
        top: 8,
        left: 8,
    },
    thumbCheckbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.7)',
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thumbCheckboxActive: {
        backgroundColor: colors.secondary,
        borderColor: colors.secondary,
    },

    /* ── Hint ── */
    hintBar: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingBottom: Platform.select({ ios: 28, default: 10 }),
    },
    hintPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.06)',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    hintText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.35)',
        fontWeight: '500',
    },

    /* ── Toast ── */
    toast: {
        position: 'absolute',
        bottom: Platform.select({ ios: 100, default: 80 }),
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(30,30,30,0.95)',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },
    toastText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },

    /* ── Selection Bar ── */
    selectionBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    selectionBarGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: Platform.select({ ios: 36, default: 20 }),
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
    },
    selectionBarBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    selectionBarBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.secondary,
    },
    selectionBarCount: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.6)',
    },
    selectionBarDeleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,107,107,0.12)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(255,107,107,0.2)',
    },
    selectionBarDeleteText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ff6b6b',
    },

    /* ── FAB ── */
    fabContainer: {
        position: 'absolute',
        bottom: Platform.select({ ios: 36, default: 24 }),
        right: 20,
    },
    fab: {
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 12,
        shadowColor: '#d4af37',
        shadowOpacity: 0.5,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },
    fabPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.92 }],
    },
    fabGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },

    /* ── Image Viewer ── */
    viewerOverlay: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewerGradientTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
    },
    viewerGradientBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 140,
    },
    viewerTopBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.select({ ios: 56, android: 46, default: 22 }),
    },
    viewerCloseBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewerCounter: {
        fontSize: 14,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 0.5,
    },
    viewerBottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        paddingBottom: Platform.select({ ios: 44, default: 28 }),
    },
    viewerDeleteBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,107,107,0.12)',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,107,107,0.2)',
    },
    viewerDeleteText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ff6b6b',
    },
})
