import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import type { RootStackParamList } from '@mobile/types/navigation'

export type AppNavigation = NativeStackNavigationProp<RootStackParamList>

export function useTypedNavigation() {
  return useNavigation<AppNavigation>()
}
