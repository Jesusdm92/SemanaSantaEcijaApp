import React from 'react'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHermandades } from '@mobile/context/HermandadesContext'
import { HermandadCard } from '@mobile/components/HermandadCard'
import { colors } from '@mobile/theme/colors'
import { useTypedNavigation } from '@mobile/hooks/useTypedNavigation'
import { useIsTablet } from '@mobile/hooks/useIsTablet'
import AlertBanner from '../components/AlertBanner'

export default function HermandadesList() {
  const navigation = useTypedNavigation()
  const { hermandades, loading, globalAlert } = useHermandades()
  const isTablet = useIsTablet()

  // En tablet mostramos 2 columnas. FlatList necesita 'key' para re-montarse
  // cuando cambia numColumns (p.ej. al rotar de landscape a portrait).
  const numColumns = isTablet ? 2 : 1

  return (
    <SafeAreaView style={styles.safe}>
      {globalAlert?.active && (
        <AlertBanner
          type={globalAlert.type}
          title="AVISO GENERAL"
          message={globalAlert.message}
        />
      )}
      {loading ? (
        <Text style={styles.loading}>Cargando...</Text>
      ) : (
        <FlatList
          key={numColumns} // fuerza re-mount cuando cambia numColumns
          data={hermandades}
          keyExtractor={item => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          columnWrapperStyle={isTablet ? styles.columnWrapper : undefined}
          renderItem={({ item }) => (
            <View style={isTablet ? styles.cardWrapperTablet : styles.cardWrapperPhone}>
              <HermandadCard
                hermandad={item}
                onPress={() => navigation.navigate('Detail', { id: item.id })}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: 16, paddingTop: 12 },
  loading: { padding: 16 },
  // Tablet grid
  columnWrapper: { gap: 12 },
  cardWrapperPhone: { flex: 1 },
  cardWrapperTablet: { flex: 1 },
})
