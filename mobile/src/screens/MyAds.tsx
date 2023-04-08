import { useCallback, useState } from 'react'
import { AdCard } from '@components/AdCard'
import { HeaderScreen } from '@components/HeaderScreen'
import { ProductDTO } from '@dtos/ProductDTO'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { FlatList, HStack, Select, Text, VStack } from 'native-base'
import { CaretDown, Plus } from 'phosphor-react-native'
import { Loading } from '@components/Loading'

export function MyAds() {
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [filteredAds, setFilteredAds] = useState<ProductDTO[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleNewAd() {
    navigation.navigate('newAd')
  }

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const response = await api.get('/users/products')
      setProducts(response.data.reverse())
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  function handleMyAdDetails(productId: string) {
    navigation.navigate('myAdDetails', { productId })
  }

  function handleFilteredAds(value: string) {
    if (value === 'active') {
      const activeFilteredAds = products.filter(
        (product) => product.is_active === true,
      )
      setFilteredAds(activeFilteredAds)
    }

    if (value === 'inactive') {
      const inactiveFilteredAds = products.filter(
        (product) => product.is_active === false,
      )
      setFilteredAds(inactiveFilteredAds)
    }

    if (value === 'all') {
      setFilteredAds(products)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, []),
  )

  return (
    <VStack flex={1} pt={16} px={6}>
      <HeaderScreen
        title="Meus anúncios"
        iconRight={<Plus size={24} color="#1A181B" />}
        onPressIconRight={handleNewAd}
      />

      <HStack justifyContent="space-between" alignItems="center" mt={8}>
        <Text fontSize="sm" fontFamily="body" color="gray.600">
          {filteredAds.length === 0 ? products.length : filteredAds.length}{' '}
          anúncios
        </Text>
        <Select
          w={32}
          h={10}
          color="gray.700"
          fontSize="sm"
          fontFamily="body"
          defaultValue="all"
          onValueChange={(value) => handleFilteredAds(value)}
          dropdownIcon={
            <CaretDown size={16} color="#5F5B62" style={{ marginRight: 8 }} />
          }
        >
          <Select.Item label="Todos" value="all" />
          <Select.Item label="Ativos" value="active" />
          <Select.Item label="Inativos" value="inactive" />
        </Select>
      </HStack>
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={filteredAds.length === 0 ? products : filteredAds}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AdCard
              isMyAd
              onPress={() => handleMyAdDetails(item.id)}
              product={item}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
          mt={5}
          showsVerticalScrollIndicator={false}
          h="full"
        />
      )}
    </VStack>
  )
}
