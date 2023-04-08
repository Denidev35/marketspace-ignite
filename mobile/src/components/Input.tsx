import {
  Input as InputNativeBase,
  IInputProps,
  Pressable,
  FormControl,
} from 'native-base'
import { Eye, EyeClosed } from 'phosphor-react-native'
import { useState } from 'react'

type Props = IInputProps & {
  errorMessage?: string | null
}

export function Input({
  secureTextEntry,
  errorMessage = null,
  isInvalid,
  ...rest
}: Props) {
  const [secret, setSecret] = useState(secureTextEntry)
  const invalid = !!errorMessage || isInvalid

  const SecretIcon = () => {
    return (
      <Pressable mr={4} onPress={() => setSecret(!secret)}>
        {secret ? (
          <Eye size={20} color="#9F9BA1" />
        ) : (
          <EyeClosed size={20} color="#9F9BA1" />
        )}
      </Pressable>
    )
  }

  return (
    <FormControl isInvalid={invalid} mt={4}>
      <InputNativeBase
        bg="gray.100"
        h={12}
        w="full"
        rounded="lg"
        borderWidth={0}
        fontSize="md"
        color="gray.600"
        fontFamily="body"
        placeholderTextColor="gray.400"
        px={4}
        isInvalid={invalid}
        _invalid={{
          borderWidth: 1,
          borderColor: 'red.500',
        }}
        secureTextEntry={secret}
        _focus={{
          bg: 'gray.100',
          borderWidth: 1,
          borderColor: 'gray.500',
        }}
        InputRightElement={secureTextEntry ? <SecretIcon /> : undefined}
        {...rest}
      />
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  )
}
