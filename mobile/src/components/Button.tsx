import { Button as ButtonNativeBase, Text, IButtonProps } from 'native-base'

type Props = IButtonProps & {
  title: string
  variant?: 'Primary' | 'Secondary' | 'Tertiary'
}

export function Button({ title, variant = 'Primary', ...rest }: Props) {
  return (
    <ButtonNativeBase
      w="full"
      p={3}
      bg={
        variant === 'Primary'
          ? 'blue.500'
          : variant === 'Secondary'
          ? 'gray.700'
          : 'gray.300'
      }
      rounded="lg"
      _pressed={{
        bg:
          variant === 'Primary'
            ? 'blue.400'
            : variant === 'Secondary'
            ? 'gray.600'
            : 'gray.200',
      }}
      {...rest}
    >
      <Text
        color={variant === 'Tertiary' ? 'gray.600' : 'gray.100'}
        fontFamily="heading"
        fontSize="sm"
      >
        {title}
      </Text>
    </ButtonNativeBase>
  )
}
