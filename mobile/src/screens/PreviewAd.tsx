/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react'
import { UserPhoto } from '@components/UserPhoto'
import {
  Box,
  Center,
  Heading,
  HStack,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base'
import { ArrowLeft, Tag } from 'phosphor-react-native'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { PaymentMethod } from '@components/PaymentMethods'
import { Button } from '@components/Button'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { api } from '@services/api'
import { ProductDTO } from '@dtos/ProductDTO'
import { AppError } from '@utils/AppError'
import { Loading } from '@components/Loading'
import { Carousel } from '@components/Carousel'

type RouteParamsProps = {
  productId: string
}

export function PreviewAd() {
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)
  const [isLoading, setIsLoading] = useState(true)

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const toast = useToast()
  const { productId } = route.params as RouteParamsProps

  async function fetchProduct() {
    try {
      setIsLoading(true)

      const response = await api.get(`/products/${productId}`)
      setProduct(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o produto. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  function handleGoBackAndEdit() {
    navigation.navigate('editAd', { productId: product.id })
  }

  function handleMyAds() {
    navigation.navigate('myAds')
  }

  useFocusEffect(
    useCallback(() => {
      fetchProduct()
    }, []),
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} pt={16} bg="blue.500">
      <Center bg="blue.500" pb={4}>
        <Heading fontSize="md" fontFamily="heading" color="gray.100">
          Pré visualização do anúncio
        </Heading>
        <Text fontSize="sm" fontFamily="body" color="gray.100">
          É assim que seu produto vai aparecer!
        </Text>
      </Center>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bg="gray.200"
      >
        <Carousel data={product.product_images} />
        <VStack px={6} mt={5} mb={7} bg="gray.200">
          <HStack alignItems="center">
            <UserPhoto
              source={{
                uri: `${api.defaults.baseURL}/images/${product.user.avatar}`,
              }}
              size={6}
              borderWidth={2}
            />
            <Text fontSize="sm" fontFamily="body" color="gray.700" ml={2}>
              {product.user.name}
            </Text>
          </HStack>

          <Box
            px={2}
            py={0.5}
            mt={6}
            rounded="full"
            bg="gray.300"
            w={12}
            alignItems="center"
          >
            <Text
              fontSize="2xs"
              color="gray.600"
              fontFamily="heading"
              textTransform="uppercase"
            >
              {product.is_new ? 'Novo' : 'Usado'}
            </Text>
          </Box>
          <HStack justifyContent="space-between" alignItems="center" mt={2}>
            <Heading fontSize="lg" fontFamily="heading" color="gray.700">
              {product.name}
            </Heading>
            <HStack>
              <Text
                fontSize="sm"
                fontFamily="heading"
                color="blue.500"
                alignSelf="flex-end"
              >
                R${' '}
              </Text>
              <Heading fontSize="lg" fontFamily="heading" color="blue.500">
                {product.price.toFixed(2).replace('.', ',')}
              </Heading>
            </HStack>
          </HStack>
          <Text mt={2} fontSize="sm" fontFamily="body" color="gray.600">
            {product.description}
          </Text>

          <HStack mt={6} alignItems="center">
            <Heading fontSize="sm" fontFamily="heading" color="gray.600" mr={2}>
              Aceita troca?
            </Heading>
            <Text fontSize="sm" fontFamily="body" color="gray.600">
              {product.accept_trade === true ? 'Sim' : 'Não'}
            </Text>
          </HStack>
          <VStack mt={4}>
            <Heading fontSize="sm" fontFamily="heading" color="gray.600">
              Meios de pagamento:
            </Heading>
            {product.payment_methods.map((method) => (
              <PaymentMethod method={method.name} key={method.key} />
            ))}
          </VStack>
        </VStack>
      </ScrollView>
      <HStack alignItems="center" pt={5} pb={7} bg="gray.100" px={6}>
        <Button
          title="Voltar e editar"
          variant="Tertiary"
          mr={3}
          flex={1}
          leftIcon={<ArrowLeft size={16} color="#3E3A40" />}
          onPress={handleGoBackAndEdit}
        />
        <Button
          title="Publicar"
          leftIcon={<Tag size={16} color="#EDECEE" />}
          flex={1}
          onPress={handleMyAds}
        />
      </HStack>
    </VStack>
  )
}
