import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Hermandad } from '@mobile/types/hermandad'
import { colors } from '@mobile/theme/colors'
import { getEscudoSource } from '@mobile/utils/escudos'

interface Props {
  hermandad: Hermandad
  onPress: () => void
  onToggleFavorite?: () => void
}

export const HermandadCard: React.FC<Props> = ({ hermandad, onPress, onToggleFavorite }) => {
  const escudoSource = getEscudoSource(hermandad.shieldUrl)

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {escudoSource ? (
        <Image
          source={escudoSource}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Text style={styles.shieldLetter}>{hermandad.name.charAt(0)}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{hermandad.name}</Text>
        <Text style={styles.day}>{hermandad.day}</Text>
        <View style={styles.timeRow}>
          <Ionicons name="log-out-outline" size={16} color={colors.primary} />
          <Text style={styles.times}>{hermandad.exitTime}h</Text>
          <Ionicons name="log-in-outline" size={16} color={colors.primary} style={{ marginLeft: 12 }} />
          <Text style={styles.times}>{hermandad.entryTime}h</Text>
        </View>
        {onToggleFavorite && (
          <TouchableOpacity onPress={onToggleFavorite} style={styles.favBtn} accessibilityLabel="Favorito">
            <Text style={styles.favText}>{hermandad.isFavorite ? '★' : '☆'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    flexDirection: 'row'
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: '#eee'
  },
  imageFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary
  },
  shieldLetter: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.secondary
  },
  content: {
    flex: 1,
    padding: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary
  },
  day: {
    marginTop: 4,
    fontSize: 13,
    color: colors.secondary
  },
  times: {
    marginTop: 6,
    fontSize: 12,
    color: '#444'
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8
  },
  favText: {
    fontSize: 20,
    color: colors.secondary
  },
  timeRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 }
})
