import { useCallback, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { Heading, HStack, Text, VStack } from 'native-base'
import { ArrowRight, Tag } from 'phosphor-react-native'
import { TouchableOpacity } from 'react-native'
import { ProductDTO } from '@dtos/ProductDTO'

export function InfoCard() {
  const [userProducts, setUserProducts] = useState<ProductDTO[]>([])
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleMyAds() {
    navigation.navigate('myAds')
  }

  async function fetchUserProduct() {
    try {
      const response = await api.get('users/products')
      setUserProducts(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const userProductsActives = userProducts.filter(
    (product) => product.is_active === true,
  )

  useFocusEffect(
    useCallback(() => {
      fetchUserProduct()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userProductsActives.length]),
  )

  return (
    <TouchableOpacity onPress={handleMyAds}>
      <HStack
        px={4}
        py={3}
        bg="rgba(100, 122, 199, 0.1)"
        w="full"
        justifyContent="space-between"
        alignItems="center"
        rounded="md"
      >
        <HStack alignItems="center">
          <Tag size={22} color="#364D9D" />

          <VStack ml={4}>
            <Heading fontSize="lg" color="gray.600" fontFamily="heading">
              {userProductsActives.length}
            </Heading>
            <Text fontSize="xs" color="gray.600" fontFamily="body">
              anúncios ativos
            </Text>
          </VStack>
        </HStack>

        <HStack>
          <Text fontSize="xs" color="blue.700" fontFamily="heading" mr={2}>
            Meus anúncios
          </Text>
          <ArrowRight size={16} color="#364D9D" />
        </HStack>
      </HStack>
    </TouchableOpacity>
  )
}
