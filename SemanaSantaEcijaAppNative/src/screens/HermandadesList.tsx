import React from 'react'
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native'
import { useHermandades } from '@mobile/context/HermandadesContext'
import { HermandadCard } from '@mobile/components/HermandadCard'
import { colors } from '@mobile/theme/colors'
import { useTypedNavigation } from '@mobile/hooks/useTypedNavigation'
export default function HermandadesList() {
  const navigation = useTypedNavigation()
  const { hermandades, loading } = useHermandades()

  return (
    <SafeAreaView style={styles.safe}>
      {loading ? (
        <Text style={styles.loading}>Cargando...</Text>
      ) : (
        <FlatList
          data={hermandades}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <HermandadCard
              hermandad={item}
              onPress={() => navigation.navigate('Detail', { id: item.id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingTop: 12 },
  loading: { padding: 16 }
})
