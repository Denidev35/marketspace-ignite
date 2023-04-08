import { useState } from 'react'
import {
  Center,
  Heading,
  ScrollView,
  Text,
  VStack,
  useToast,
} from 'native-base'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { useNavigation } from '@react-navigation/native'

import LogoImg from '@assets/logo.svg'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'

type FormDataProps = {
  email: string
  password: string
}

const signInSchema = yup.object({
  email: yup.string().required('Informe o e-mail.'),
  password: yup.string().required('Informe a senha.'),
})

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const toast = useToast()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema),
  })

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormDataProps) {
    try {
      setIsLoading(true)

      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde.'

      setIsLoading(false)

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
      <VStack flex={1} bg="gray.100">
        <VStack
          flex={1}
          rounded="3xl"
          bg="gray.200"
          px={12}
          justifyContent="center"
        >
          <Center>
            <LogoImg />
            <Heading
              color="gray.700"
              fontSize="4xl"
              fontFamily="heading"
              mt={5}
            >
              marketspace
            </Heading>
            <Text fontSize="sm" color="gray.500" fontFamily="body">
              Seu espaço de compra e venda
            </Text>
          </Center>

          <Center mt={20}>
            <Text fontSize="sm" color="gray.600" fontFamily="body">
              Acesse sua conta
            </Text>

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

            <Button
              title="Entrar"
              mt={8}
              onPress={handleSubmit(handleSignIn)}
              isLoading={isLoading}
            />
          </Center>
        </VStack>
        <VStack h={56} bg="gray.100" px={12} justifyContent="center">
          <Center>
            <Text fontSize="sm" color="gray.600" fontFamily="body" mb={4}>
              Ainda não tem acesso?
            </Text>
            <Button
              title="Criar uma conta"
              variant="Tertiary"
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}
