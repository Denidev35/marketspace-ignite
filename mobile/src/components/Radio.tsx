import {
  Radio as RadioNativeBase,
  IRadioGroupProps,
  IRadioProps,
  Text,
  FormControl,
} from 'native-base'
import { ReactNode } from 'react'

type GroupProps = IRadioGroupProps & {
  children: ReactNode
  errorMessage?: string | null
}

export function RadioGroup({
  children,
  errorMessage = null,
  ...rest
}: GroupProps) {
  return (
    <FormControl isInvalid={!!errorMessage}>
      <RadioNativeBase.Group {...rest}>{children}</RadioNativeBase.Group>
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  )
}

type RadioProps = IRadioProps & {
  title: string
}

export function Radio({ title, ...rest }: RadioProps) {
  return (
    <RadioNativeBase
      bgColor="gray.200"
      _checked={{ borderColor: 'blue.500' }}
      _icon={{ color: 'blue.500' }}
      size="sm"
      {...rest}
    >
      <Text color="gray.600" fontSize="md" fontFamily="body">
        {title}
      </Text>
    </RadioNativeBase>
  )
}
