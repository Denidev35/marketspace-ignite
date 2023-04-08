import {
  Checkbox as CheckboxNativeBase,
  Text,
  ICheckboxProps,
  ICheckboxGroupProps,
  FormControl,
} from 'native-base'
import { ReactNode } from 'react'

type CheckboxGroupProps = ICheckboxGroupProps & {
  children: ReactNode
  errorMessage?: string | null
}

export function CheckboxGroup({
  children,
  errorMessage = null,
  ...rest
}: CheckboxGroupProps) {
  return (
    <FormControl isInvalid={!!errorMessage}>
      <CheckboxNativeBase.Group {...rest}>{children}</CheckboxNativeBase.Group>
      <FormControl.ErrorMessage>{errorMessage}</FormControl.ErrorMessage>
    </FormControl>
  )
}

type CheckboxProps = ICheckboxProps & {
  title: string
}

export function Checkbox({ title, ...rest }: CheckboxProps) {
  return (
    <CheckboxNativeBase
      mb={2}
      size="md"
      bgColor="gray.200"
      _checked={{
        bg: 'blue.500',
        borderColor: 'blue.500',
      }}
      {...rest}
    >
      <Text
        fontSize="md"
        fontFamily="body"
        color="gray.600"
        textTransform="capitalize"
      >
        {title}
      </Text>
    </CheckboxNativeBase>
  )
}
