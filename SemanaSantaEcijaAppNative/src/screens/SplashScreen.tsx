import React, { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated, StatusBar } from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import type { RootStackParamList } from '@mobile/types/navigation'

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>

export default function SplashScreen({ navigation }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Fade In
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    // Wait and Fade Out
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Tabs')
      })
    }, 2500)

    return () => clearTimeout(timer)
  }, [navigation, fadeAnim])

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={require('../../assets/splash-2026.jpg')}
        style={[styles.image, { opacity: fadeAnim }]}
        resizeMode="stretch"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})
