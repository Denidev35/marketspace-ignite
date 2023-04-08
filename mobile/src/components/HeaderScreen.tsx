import { Box, Heading, HStack, Icon, IContainerProps } from 'native-base'
import { ReactNode } from 'react'
import { TouchableOpacity } from 'react-native'

type Props = IContainerProps & {
  title?: string
  iconRight?: ReactNode
  iconLeft?: ReactNode
  onPressIconLeft?: () => void
  onPressIconRight?: () => void
}

export function HeaderScreen({
  title,
  iconRight,
  iconLeft,
  onPressIconLeft,
  onPressIconRight,
  ...rest
}: Props) {
  return (
    <HStack justifyContent="space-between" alignItems="center" {...rest}>
      {iconLeft ? (
        <TouchableOpacity onPress={onPressIconLeft}>
          <Icon as={iconLeft} />
        </TouchableOpacity>
      ) : (
        <Box />
      )}
      <Heading fontSize="lg" color="gray.700" fontFamily="heading">
        {title}
      </Heading>
      {iconRight ? (
        <TouchableOpacity onPress={onPressIconRight}>
          <Icon as={iconRight} />
        </TouchableOpacity>
      ) : (
        <Box />
      )}
    </HStack>
  )
}
