import React, { useCallback, useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import * as ExpoSplashScreen from 'expo-splash-screen'
import type { RootStackParamList } from './src/types/navigation'
import SplashScreen from './src/screens/SplashScreen'
import HermandadDetail from './src/screens/HermandadDetail'
import { TabsNavigator } from './src/navigation/TabsNavigator'
import { HermandadesProvider } from './src/context/HermandadesContext'
import {
  configureForegroundHandler,
  registerForNotifications,
  getExpoPushToken,
  registerPushToken,
  savePushTokenLocally,
  syncPreferencesToSupabase,
} from './src/services/notificationService'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Configurar handler de notificaciones en primer plano
configureForegroundHandler()

// Mantener la splash nativa visible hasta que esté lista
ExpoSplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator<RootStackParamList>()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Solicitar permisos de notificación
        const granted = await registerForNotifications()

        // Si los permisos fueron concedidos, registrar push token en Supabase
        if (granted) {
          const pushToken = await getExpoPushToken()
          if (pushToken) {
            await savePushTokenLocally(pushToken)
            await registerPushToken(pushToken)

            // Sincronizar preferencias guardadas con Supabase
            const PREFS_KEY = 'SS_ECIJA_NOTIFICATION_PREFS'
            const savedPrefs = await AsyncStorage.getItem(PREFS_KEY)
            if (savedPrefs) {
              const prefs = JSON.parse(savedPrefs)
              await syncPreferencesToSupabase(pushToken, prefs)
            }
          }
        }

        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (e) {
        console.warn(e)
      } finally {
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Ocultar la splash nativa cuando la app esté lista
      await ExpoSplashScreen.hideAsync()
    }
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
    <HermandadesProvider>
      <NavigationContainer onReady={onLayoutRootView}>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Tabs" component={TabsNavigator} />
          <Stack.Screen name="Detail" component={HermandadDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </HermandadesProvider>
  )
}
