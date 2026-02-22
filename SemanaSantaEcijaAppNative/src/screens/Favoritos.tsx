import React from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import { useHermandades } from '@mobile/context/HermandadesContext'
import { HermandadCard } from '@mobile/components/HermandadCard'
import { colors } from '@mobile/theme/colors'
import { Hermandad } from '@mobile/types/hermandad'
import { useTypedNavigation } from '@mobile/hooks/useTypedNavigation'
import AlertBanner from '../components/AlertBanner'

export default function Favoritos() {
  const navigation = useTypedNavigation()
  const { hermandades, globalAlert } = useHermandades()
  const favoritos = hermandades.filter((h: Hermandad) => h.isFavorite)
  return (
    <SafeAreaView style={styles.safe}>
      {globalAlert?.active && (
        <AlertBanner
          type={globalAlert.type}
          title="AVISO GENERAL"
          message={globalAlert.message}
        />
      )}
      {favoritos.length === 0 ? (
        <Text style={styles.empty}>No tienes favoritos aún.</Text>
      ) : (
        <FlatList
          data={favoritos}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <HermandadCard hermandad={item} onPress={() => navigation.navigate('Detail', { id: item.id })} />
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingTop: 12 },
  empty: { padding: 16 }
})
