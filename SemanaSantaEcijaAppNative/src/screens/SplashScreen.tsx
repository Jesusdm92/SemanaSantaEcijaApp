import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { colors } from '@mobile/theme/colors'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '@mobile/types/navigation'

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current
  const dot1Anim = useRef(new Animated.Value(0.3)).current
  const dot2Anim = useRef(new Animated.Value(0.3)).current
  const dot3Anim = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start()

    // Animación de puntos (carga)
    const dotAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.parallel([
          Animated.timing(dot1Anim, { toValue: 0.3, duration: 0, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 0.3, duration: 0, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 0.3, duration: 0, useNativeDriver: true }),
        ]),
      ])
    )
    dotAnimation.start()

    // Navegar después de 2 segundos con animación de salida
    const timer = setTimeout(() => {
      dotAnimation.stop()
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace('Tabs')
      })
    }, 2000)

    return () => {
      clearTimeout(timer)
      dotAnimation.stop()
    }
  }, [navigation, fadeAnim, scaleAnim, dot1Anim, dot2Anim, dot3Anim])

  return (
    <LinearGradient
      colors={['#2a004e', '#4b0082', '#6a1b9a']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Semana Santa</Text>
        <Text style={styles.city}>Écija</Text>
        <View style={styles.yearBadge}>
          <Text style={styles.year}>2025</Text>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
        <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { 
    fontSize: 36, 
    fontWeight: '700', 
    color: '#fff',
    letterSpacing: 1,
    textAlign: 'center',
  },
  city: {
    fontSize: 42,
    fontWeight: '800',
    color: colors.secondary,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  yearBadge: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  year: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
    letterSpacing: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
})
