import type { RouteProp } from '@react-navigation/native'

export type TabsParamList = {
  ListTab: undefined
  FavoritosTab: undefined
  AboutTab: undefined
}

export type RootStackParamList = {
  Splash: undefined
  Tabs: undefined
  Detail: { id: number }
}

export type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>
