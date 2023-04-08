import { useCallback, useState } from 'react'
import {
  Box,
  Heading,
  HStack,
  ScrollView,
  Text,
  useToast,
  VStack,
} from 'native-base'
import {
  ArrowLeft,
  PencilSimpleLine,
  Power,
  TrashSimple,
} from 'phosphor-react-native'
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
import { Loading } from '@components/Loading'
import { HeaderScreen } from '@components/HeaderScreen'
import { AppError } from '@utils/AppError'
import { Carousel } from '@components/Carousel'
import { UserPhoto } from '@components/UserPhoto'

type RouteParamsProps = {
  productId: string
}

export function MyAdDetails() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [product, setProduct] = useState<ProductDTO>({} as ProductDTO)
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const route = useRoute()
  const toast = useToast()

  const { productId } = route.params as RouteParamsProps

  function handleGoBackMyAds() {
    navigation.navigate('myAds')
  }

  function handleEditAd() {
    navigation.navigate('editAd', { productId })
  }

  async function fetchProduct() {
    try {
      setIsLoading(true)
      const response = await api.get(`/products/${productId}`)
      setProduct(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o anúncio. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleEnableAd() {
    try {
      setIsLoadingUpdate(true)
      await api.patch(`/products/${productId}`, {
        is_active: true,
      })
      product.is_active = true
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoadingUpdate(false)
    }
  }

  async function handleDisableAd() {
    try {
      setIsLoadingUpdate(true)
      await api.patch(`/products/${productId}`, {
        is_active: false,
      })
      product.is_active = false
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar o anúncio. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoadingUpdate(false)
    }
  }

  async function handleRemoveAd() {
    try {
      await api.delete(`products/${productId}`)
      navigation.navigate('myAds')
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível excluir o anúncio. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProduct()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId]),
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} pt={16}>
      <HeaderScreen
        iconLeft={<ArrowLeft size={24} color="#1A181B" />}
        iconRight={<PencilSimpleLine size={24} color="#1A181B" />}
        px={6}
        mb={3}
        onPressIconLeft={handleGoBackMyAds}
        onPressIconRight={handleEditAd}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Carousel data={product.product_images} isActive={product.is_active} />
        <VStack px={6} mt={5} mb={7}>
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
              {product.is_new === true ? 'Novo' : 'Usado'}
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
          <VStack space={2} mt={8}>
            <Button
              title={
                product.is_active === true
                  ? 'Desativar anúncio'
                  : 'Reativar anúncio'
              }
              variant={product.is_active === true ? 'Secondary' : 'Primary'}
              leftIcon={<Power size={16} color="#EDECEE" />}
              onPress={
                product.is_active === true ? handleDisableAd : handleEnableAd
              }
              isLoading={isLoadingUpdate}
            />

            <Button
              title="Excluir anúncio"
              variant="Tertiary"
              leftIcon={<TrashSimple size={16} color="#5F5B62" />}
              onPress={handleRemoveAd}
            />
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  )
}
