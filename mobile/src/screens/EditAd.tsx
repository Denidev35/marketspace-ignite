/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import {
  FormControl,
  Heading,
  HStack,
  ScrollView,
  Switch,
  Text,
  useToast,
  VStack,
} from 'native-base'
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { ArrowLeft, Plus } from 'phosphor-react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import CurrencyInput from 'react-native-currency-input'

import { Button } from '@components/Button'
import { Checkbox, CheckboxGroup } from '@components/Checkbox'
import { HeaderScreen } from '@components/HeaderScreen'
import { Input } from '@components/Input'
import { Radio, RadioGroup } from '@components/Radio'
import { TextArea } from '@components/TextArea'

import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { ImageCard } from '@components/ImageCard'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { Loading } from '@components/Loading'
import { PaymentMethodsDTO } from '@dtos/ProductDTO'

const newProductSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  description: yup.string().required('Informe a descrição'),
  is_new: yup.boolean().required('Informe a condição do produto.'),
  price: yup.number().required('Informe o preço do produto.'),
  accept_trade: yup.boolean(),
  payment_methods: yup
    .array()
    .of(yup.string().min(1, 'Informe pelo menos uma forma de pagamento.'))
    .required('Informa as formas de pagamento.'),
})

type FormDataProps = yup.InferType<typeof newProductSchema>

type RouteParamsProps = {
  productId: string
}

type NewImages = {
  id: string
  path: string
  new: boolean
}

export function EditAd() {
  const [productImages, setProductImages] = useState<NewImages[]>([])
  const [idOfImagesRemoved, setIdOfImagesRemoved] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const route = useRoute()
  const toast = useToast()

  const { productId } = route.params as RouteParamsProps

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(newProductSchema),
  })

  async function fetchProductUpdate() {
    try {
      setIsLoading(true)

      const response = await api.get(`/products/${productId}`)
      const paymentMethod = response.data.payment_methods.map(
        (methods: PaymentMethodsDTO) => methods.key,
      )

      const defaultValues = {
        name: response.data.name,
        description: response.data.description,
        is_new: response.data.is_new,
        price: response.data.price,
        accept_trade: response.data.accept_trade,
        payment_methods: paymentMethod,
      }
      reset(defaultValues)

      setProductImages(response.data.product_images)
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

  function handleGoBack() {
    navigation.navigate('myAdDetails', { productId })
    setIdOfImagesRemoved([])
  }

  async function handleProductImageSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsMultipleSelection: true,
        selectionLimit: 3,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets.length > 3) {
        return toast.show({
          title: 'Só é possível selecionar até 3 fotos.',
          placement: 'top',
          bgColor: 'red.500',
        })
      }

      if (photoSelected.assets.length > 0) {
        photoSelected.assets.forEach(async (photo) => {
          const photoInfo = await FileSystem.getInfoAsync(photo.uri)

          if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
            return toast.show({
              title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
              placement: 'top',
              bgColor: 'red.500',
            })
          }
        })
      }
      const newPhoto: NewImages = {
        id: photoSelected.assets[0].uri,
        path: photoSelected.assets[0].uri,
        new: true,
      }

      setProductImages((prevState) => [...prevState, newPhoto])
    } catch (error) {
      console.log(error)
    }
  }

  async function handleRemoveImage(id: string) {
    const filteredImages = productImages.filter((photo) => photo.id !== id)
    setProductImages(filteredImages)
    const imageRemove = productImages.find((photo) => photo.id === id)
    if (imageRemove?.new !== true) {
      setIdOfImagesRemoved((prevState) => [...prevState, id])
    }
  }

  async function handleEditProduct({
    name,
    description,
    is_new,
    payment_methods,
    price,
    accept_trade,
  }: FormDataProps) {
    if (productImages.length === 0) {
      return toast.show({
        title: 'Selecione pelo menos uma imagem para seu anúncio.',
        placement: 'top',
        bgColor: 'red.500',
      })
    }

    try {
      setIsLoading(true)
      const product = {
        name,
        description,
        is_new: Boolean(is_new),
        payment_methods,
        price: Number(price),
        accept_trade,
      }
      await api.put(`/products/${productId}`, product)

      const productsImageFiltered = productImages.filter(
        (image) => image.new === true,
      )

      if (productsImageFiltered.length > 0) {
        const fileExtension = productImages[0].path.split('.').pop()
        const filesImage = productsImageFiltered.map((image) => {
          return {
            name: `${name}.${fileExtension}`.toLocaleLowerCase().trim(),
            uri: image.path,
            type: `image/${fileExtension}`,
          } as any
        })

        const productImageForm = new FormData()
        productImageForm.append('product_id', productId)
        filesImage.map((image) => productImageForm.append('images', image))

        await api.post('/products/images', productImageForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      }

      if (idOfImagesRemoved.length > 0) {
        await api.delete('/products/images', {
          data: { productImagesIds: idOfImagesRemoved },
        })
      }

      setIdOfImagesRemoved([])

      navigation.navigate('previewAd', { productId })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível editar o anúncio. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchProductUpdate()
    }, [productId]),
  )

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} pt={16}>
      <HeaderScreen
        title="Editar anúncio"
        iconLeft={<ArrowLeft size={24} color="#1A181B" />}
        onPressIconLeft={handleGoBack}
        px={6}
      />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        px={6}
      >
        <VStack mt={6}>
          <Heading fontSize="md" fontFamily="heading" color="gray.600">
            Imagens
          </Heading>
          <Text fontSize="sm" fontFamily="body" color="gray.500" mt={1}>
            {`Escolha até 3 imagens para mostrar o quando o\n seu produto é incrível!`}
          </Text>
          <HStack>
            {productImages.map((image) => (
              <ImageCard
                onRemoveImage={() => handleRemoveImage(image.id)}
                source={{
                  uri:
                    image.new === true
                      ? image.path
                      : `${api.defaults.baseURL}/images/${image.path}`,
                }}
                key={image.id}
              />
            ))}
            {productImages.length < 3 && (
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: '#D9D8DA',
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 16,
                }}
                onPress={handleProductImageSelect}
              >
                <Plus size={24} color="#9F9BA1" />
              </TouchableOpacity>
            )}
          </HStack>
        </VStack>
        <VStack mt={8}>
          <Heading fontSize="md" fontFamily="heading" color="gray.600">
            Sobre o produto
          </Heading>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Titulo do anúncio"
                onChangeText={onChange}
                errorMessage={errors.name?.message}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <FormControl mb={4} isInvalid={!!errors}>
                <TextArea
                  placeholder="Descrição do produto"
                  onChangeText={onChange}
                  value={value}
                />
                <FormControl.ErrorMessage>
                  {errors.description?.message}
                </FormControl.ErrorMessage>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="is_new"
            render={({ field: { onChange, value } }) => (
              <RadioGroup
                name="productUsedOrNew"
                onChange={onChange}
                errorMessage={errors.is_new?.message}
                value={String(value)}
              >
                <HStack alignItems="center" space={5}>
                  <Radio value="true" title="Produto novo" />
                  <Radio value="false" title="Produto usado" />
                </HStack>
              </RadioGroup>
            )}
          />
        </VStack>
        <VStack mt={8} mb={6}>
          <Heading fontSize="md" fontFamily="heading" color="gray.600">
            Venda
          </Heading>
          <Controller
            control={control}
            name="price"
            render={({ field: { onChange, value } }) => (
              <CurrencyInput
                value={value}
                delimiter="."
                separator=","
                precision={2}
                onChangeValue={onChange}
                renderTextInput={(textInputProps) => (
                  <Input
                    placeholder="Valor do produto"
                    {...textInputProps}
                    pl={2}
                    keyboardType="numeric"
                    errorMessage={errors.price?.message}
                    InputLeftElement={
                      <Text
                        fontSize="md"
                        fontFamily="body"
                        color="gray.700"
                        ml={4}
                      >
                        R$
                      </Text>
                    }
                  />
                )}
              />
            )}
          />

          <Text fontSize="sm" fontFamily="heading" color="gray.600" mt={4}>
            Aceita troca?
          </Text>
          <Controller
            control={control}
            name="accept_trade"
            render={({ field: { onChange, value } }) => (
              <Switch
                alignSelf="flex-start"
                size="lg"
                offThumbColor="gray.100"
                offTrackColor="gray.300"
                onTrackColor="blue.500"
                onToggle={onChange}
                value={value}
                isChecked={value}
              />
            )}
          />

          <Text fontSize="sm" fontFamily="heading" color="gray.600" mb={3}>
            Meios de pagamento aceitos
          </Text>
          <Controller
            control={control}
            name="payment_methods"
            render={({ field: { onChange, value } }) => (
              <CheckboxGroup
                onChange={onChange}
                errorMessage={errors.payment_methods?.message}
                value={value as string[]}
              >
                <Checkbox title="Boleto" value="boleto" />
                <Checkbox title="Pix" value="pix" />
                <Checkbox title="Dinheiro" value="cash" />
                <Checkbox title="Cartão de Crédito" value="card" />
                <Checkbox title="Depósito Bancário" value="deposit" />
              </CheckboxGroup>
            )}
          />
        </VStack>
      </ScrollView>
      <HStack alignItems="center" pt={5} pb={7} bg="gray.100" px={6}>
        <Button
          title="Cancelar"
          variant="Tertiary"
          mr={3}
          flex={1}
          onPress={handleGoBack}
        />
        <Button
          title="Avançar"
          variant="Secondary"
          flex={1}
          onPress={handleSubmit(handleEditProduct)}
          isLoading={isLoading}
        />
      </HStack>
    </VStack>
  )
}
