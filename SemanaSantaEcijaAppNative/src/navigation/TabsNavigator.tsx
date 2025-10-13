import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HermandadesList from '../screens/HermandadesList';
import Favoritos from '../screens/Favoritos';
import AgendaCofrade from '../screens/AgendaCofrade';
import HoySale from '../screens/HoySale';
import About from '../screens/About';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const base = 'Semana Santa Écija - ';
        let section = 'Hermandades';
        if (route.name === 'FavoritosTab') section = 'Favoritos';
        else if (route.name === 'AgendaTab') section = 'Agenda Cofrade';
        else if (route.name === 'HoyTab') section = 'Hoy sale…';
        else if (route.name === 'AboutTab') section = 'Acerca de';
        return {
          headerShown: true,
            headerTitle: base + section,
            headerTitleStyle: { color: '#fff', fontSize: 16 },
            headerStyle: { backgroundColor: colors.primary },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: '#888',
          tabBarStyle: { backgroundColor: '#fff' },
          tabBarIcon: ({ color, size }) => {
            let icon = 'list';
            if (route.name === 'FavoritosTab') icon = 'star';
            else if (route.name === 'AgendaTab') icon = 'calendar-clear';
            else if (route.name === 'HoyTab') icon = 'sunny';
            else if (route.name === 'AboutTab') icon = 'information-circle';
            return <Ionicons name={icon as any} size={size} color={color} />;
          }
        }
      }}
    >
      <Tab.Screen name="ListTab" component={HermandadesList} options={{ title: 'Hermandades' }} />
      <Tab.Screen name="FavoritosTab" component={Favoritos} options={{ title: 'Favoritos' }} />
      <Tab.Screen name="AgendaTab" component={AgendaCofrade} options={{ title: 'Agenda' }} />
      <Tab.Screen name="HoyTab" component={HoySale} options={{ title: 'Hoy' }} />
      <Tab.Screen name="AboutTab" component={About} options={{ title: 'Acerca de' }} />
    </Tab.Navigator>
  );
}