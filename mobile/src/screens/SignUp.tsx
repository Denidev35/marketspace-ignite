import { useState } from 'react'
import {
  Box,
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  Pressable,
  Skeleton,
  useToast,
} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { Controller, useForm } from 'react-hook-form'
import { PencilSimpleLine } from 'phosphor-react-native'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

import LogoImg from '@assets/logo.svg'
import userPhotoDefault from '@assets/userPhotoDefault.png'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { UserPhoto } from '@components/UserPhoto'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useAuth } from '@hooks/useAuth'

const PHOTO_SIZE = 22

type FormaDataProps = {
  name: string
  email: string
  tel: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  tel: yup
    .string()
    .required('Informe o telefone.')
    .max(11, 'Verifique se o telefone está correto.'),
  password: yup
    .string()
    .required('Informe a senha')
    .min(6, 'A senha deve ter pelo menos 6 dígitos.'),
  password_confirm: yup
    .string()
    .required('Confirme a senha')
    .oneOf([yup.ref('password')], 'A confirmação da senha não confere'),
})

export function SignUp() {
  const [userPhoto, setUserPhoto] =
    useState<ImagePicker.ImagePickerSuccessResult>()
  const [photoIsLoading, setPhotoIsLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toast = useToast()
  const { signIn } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormaDataProps>({
    resolver: yupResolver(signUpSchema),
  })
  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleUserPhotoSelect() {
    try {
      setPhotoIsLoading(true)

      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
        )

        if (photoInfo.exists && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500',
          })
        }
      }
      setUserPhoto(photoSelected)
    } catch (error) {
      console.log(error)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  async function handleSignUp({ name, email, tel, password }: FormaDataProps) {
    try {
      setIsLoading(true)

      if (userPhoto) {
        const fileExtension = userPhoto?.assets[0].uri.split('.').pop()

        const photoFile = {
          name: `${name}.${fileExtension}`.toLocaleLowerCase().trim(),
          uri: userPhoto?.assets[0].uri,
          type: `${userPhoto?.assets[0].type}/${fileExtension}`,
        } as any

        const newUserForm = new FormData()
        newUserForm.append('name', name)
        newUserForm.append('email', email)
        newUserForm.append('tel', tel)
        newUserForm.append('password', password)
        newUserForm.append('avatar', photoFile)

        await api.post('/users', newUserForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        await signIn(email, password)
      } else {
        await api.post('/users', { name, email, tel, password })
      }
    } catch (error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível criar conta. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack bg="gray.200" px={12} flex={1} p={16}>
        <Center>
          <LogoImg height={40} width={60} />
          <Heading color="gray.700" fontFamily="heading" fontSize="lg" mt={3}>
            Boas vindas!
          </Heading>
          <Text
            color="gray.600"
            fontFamily="body"
            fontSize="sm"
            textAlign="center"
            mt={2}
          >
            Crie sua conta e use o espaço para comprar itens variados e vender
            seus produtos
          </Text>
        </Center>
        <Center mt={8}>
          <Box>
            {photoIsLoading ? (
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                startColor="gray.400"
                endColor="gray.300"
                rounded="full"
              />
            ) : (
              <UserPhoto
                size={PHOTO_SIZE}
                source={
                  // eslint-disable-next-line no-extra-boolean-cast
                  !!userPhoto
                    ? { uri: userPhoto.assets[0].uri }
                    : userPhotoDefault
                }
              />
            )}
            <Pressable
              rounded="full"
              h={10}
              w={10}
              bg="blue.500"
              top={12}
              right={-10}
              position="absolute"
              alignItems="center"
              justifyContent="center"
              onPress={handleUserPhotoSelect}
            >
              <PencilSimpleLine size={16} color="#F7F7F8" />
            </Pressable>
          </Box>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="tel"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Telefone"
                onChangeText={onChange}
                errorMessage={errors.tel?.message}
                keyboardType="phone-pad"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange } }) => (
              <Input
                placeholder="Confirmar senha"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={onChange}
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title="Criar"
            variant="Secondary"
            mt={6}
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>
        <Center mt={12}>
          <Text fontSize="sm" color="gray.600" fontFamily="body">
            Já tem uma conta?
          </Text>
          <Button
            title="Ir para o login"
            variant="Tertiary"
            mt={3}
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
