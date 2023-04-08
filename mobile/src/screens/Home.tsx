/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import {
  Heading,
  HStack,
  Text,
  VStack,
  FlatList,
  Modal,
  Switch,
  Pressable,
  useToast,
  Box,
} from 'native-base'
import {
  MagnifyingGlass,
  Plus,
  Sliders,
  X,
  XCircle,
} from 'phosphor-react-native'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

import { UserPhoto } from '@components/UserPhoto'
import { Button } from '@components/Button'
import { InfoCard } from '@components/InfoCard'
import { Input } from '@components/Input'
import { AdCard } from '@components/AdCard'

import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { useAuth } from '@hooks/useAuth'
import { api } from '@services/api'
import { ProductDTO } from '@dtos/ProductDTO'
import { Loading } from '@components/Loading'
import { Checkbox, CheckboxGroup } from '@components/Checkbox'
import { AppError } from '@utils/AppError'

export function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isNew, setIsNew] = useState(true)
  const [acceptTrade, setAcceptTrade] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [filter, setFilter] = useState({})
  const [products, setProducts] = useState<ProductDTO[]>([])

  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()

  const { user } = useAuth()

  function handleNewAd() {
    navigation.navigate('newAd')
  }

  function handleAdDetails(productId: string) {
    navigation.navigate('adDetails', { productId })
  }

  function handleFilterProduct() {
    const newFilter = {
      is_new: isNew,
      accept_trade: acceptTrade,
      payment_methods: paymentMethods,
    }
    setFilter(newFilter)
    setShowModal(false)
  }

  function handleResetFilterProduct() {
    setAcceptTrade(false)
    setIsNew(true)
    setPaymentMethods([])
    setFilter({})
  }

  async function fetchProducts() {
    try {
      setIsLoading(true)
      const response = await api.get('/products', {
        params: { ...filter },
      })
      setProducts(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os anúncios. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function search(query: string) {
    try {
      const response = await api.get('/products', {
        params: { query },
      })

      setProducts(response.data)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível carregar os anúncios. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProducts()
    }, [filter]),
  )

  return (
    <VStack flex={1} px={6} pt={16}>
      <HStack justifyContent="space-between" alignItems="center" mb={8}>
        <HStack>
          <UserPhoto
            size={12}
            source={{ uri: `${api.defaults.baseURL}/images/${user.avatar}` }}
            borderWidth="2"
          />
          <VStack ml={3}>
            <Text fontSize="md" color="gray.700" fontFamily="body">
              Boas vindas,
            </Text>
            <Heading fontSize="md" color="gray.700" fontFamily="heading">
              {user.name}!
            </Heading>
          </VStack>
        </HStack>
        <Button
          title="Criar anúncio"
          variant="Secondary"
          w="auto"
          leftIcon={<Plus size={16} color="#F7F7F8" />}
          onPress={handleNewAd}
        />
      </HStack>
      <VStack>
        <Text mb={3} color="gray.500" fontSize="sm" fontFamily="body">
          Seus produtos anunciados para venda
        </Text>
        <InfoCard />
      </VStack>
      <VStack mt={8}>
        <Text color="gray.500" fontSize="sm" fontFamily="body" mb={-1}>
          Compre produtos variados
        </Text>
        <Input
          placeholder="Buscar anúncio"
          autoCapitalize="none"
          onChangeText={(query) => search(query)}
          InputRightElement={
            <HStack>
              <TouchableOpacity
                onPress={fetchProducts}
                style={{
                  borderRightColor: '#9F9BA1',
                  borderRightWidth: 1,
                  paddingRight: 12,
                }}
              >
                <MagnifyingGlass color="#3E3A40" size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginHorizontal: 12 }}
                onPress={() => setShowModal(true)}
              >
                <Sliders color="#3E3A40" size={20} />
              </TouchableOpacity>
            </HStack>
          }
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AdCard onPress={() => handleAdDetails(item.id)} product={item} />
          )}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
          mt={6}
          showsVerticalScrollIndicator={false}
          h="full"
        />
      )}
      <Modal
        size="full"
        isOpen={showModal}
        onClose={setShowModal}
        animationPreset="slide"
      >
        <Modal.Content
          px={6}
          py={8}
          bg="gray.200"
          mb={0}
          mt="auto"
          borderTopRadius={24}
        >
          <HStack alignItems="center" justifyContent="space-between">
            <Heading fontSize="lg" fontFamily="heading" color="gray.700">
              Filtrar anúncios
            </Heading>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <X size={24} color="#9F9BA1" />
            </TouchableOpacity>
          </HStack>
          <VStack mt={6}>
            <Heading fontSize="sm" fontFamily="heading" color="gray.600">
              Condição
            </Heading>
            <HStack space={2} alignItems="center" mt={3} mb={6}>
              <Pressable
                rounded="full"
                px={4}
                py={1.5}
                bg={isNew === true ? 'blue.500' : 'gray.300'}
                onPress={() => setIsNew(true)}
              >
                <HStack alignItems="center" space={1.5}>
                  <Text
                    fontSize="2xs"
                    color={isNew === true ? 'gray.100' : 'gray.500'}
                    fontFamily="heading"
                    textTransform="uppercase"
                  >
                    novo
                  </Text>
                  {isNew === true && (
                    <Box flex={1} mr={1.5}>
                      <XCircle size={16} weight="fill" color="#EDECEE" />
                    </Box>
                  )}
                </HStack>
              </Pressable>
              <Pressable
                onPress={() => setIsNew(false)}
                rounded="full"
                px={4}
                py={1.5}
                bg={isNew === true ? 'gray.300' : 'blue.500'}
              >
                <HStack alignItems="center" space={1.5}>
                  <Text
                    fontSize="2xs"
                    color={isNew === false ? 'gray.100' : 'gray.500'}
                    fontFamily="heading"
                    textTransform="uppercase"
                  >
                    usado
                  </Text>
                  {isNew === false && (
                    <Box flex={1} mr={1.5}>
                      <XCircle size={16} weight="fill" color="#EDECEE" />
                    </Box>
                  )}
                </HStack>
              </Pressable>
            </HStack>
            <Heading fontSize="sm" fontFamily="heading" color="gray.600">
              Aceita troca?
            </Heading>
            <Switch
              alignSelf="flex-start"
              size="lg"
              offThumbColor="gray.100"
              offTrackColor="gray.300"
              onTrackColor="blue.500"
              onToggle={setAcceptTrade}
              value={acceptTrade}
              isChecked={acceptTrade}
            />
            <Heading fontSize="sm" fontFamily="heading" color="gray.600" mt={2}>
              Meios de pagamento aceito
            </Heading>
            <CheckboxGroup
              mt={3}
              onChange={setPaymentMethods}
              value={paymentMethods}
            >
              <Checkbox title="Boleto" value="boleto" />
              <Checkbox title="Pix" value="pix" />
              <Checkbox title="Dinheiro" value="cash" />
              <Checkbox title="Cartão de Crédito" value="card" />
              <Checkbox title="Depósito Bancário" value="deposit" />
            </CheckboxGroup>
            <HStack space={3} mt={16}>
              <Button
                title="Resetar filtros"
                variant="Tertiary"
                flex={1}
                onPress={handleResetFilterProduct}
              />
              <Button
                title="Aplicar filtros"
                variant="Secondary"
                flex={1}
                onPress={handleFilterProduct}
              />
            </HStack>
          </VStack>
        </Modal.Content>
      </Modal>
    </VStack>
  )
}
