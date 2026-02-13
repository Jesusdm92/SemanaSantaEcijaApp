import type { RouteProp, NavigatorScreenParams } from '@react-navigation/native'

export type TabsParamList = {
  ListTab: undefined
  FavoritosTab: undefined
  AgendaTab: undefined
  HoyTab: undefined
  AboutTab: undefined
}

export type RootStackParamList = {
  Splash: undefined
  Tabs: NavigatorScreenParams<TabsParamList>
  Detail: { id: number }
}

export type DetailRouteProp = RouteProp<RootStackParamList, 'Detail'>
