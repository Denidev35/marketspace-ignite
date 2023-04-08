import { Box, Heading, HStack, Image, Text } from 'native-base'
import { UserPhoto } from './UserPhoto'

import { TouchableOpacity } from 'react-native'
import { ProductDTO } from '@dtos/ProductDTO'
import { api } from '@services/api'

type Props = {
  isMyAd?: boolean
  onPress: () => void
  product: ProductDTO
}

export function AdCard({ isMyAd = false, onPress, product }: Props) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        source={{
          uri: `${api.defaults.baseURL}/images/${product.product_images[0].path}`,
        }}
        alt="Tênis vermelho"
        resizeMode="contain"
        w={40}
        h={24}
        rounded="md"
        opacity={product.is_active === false ? 0.45 : 1}
        bg="gray.700"
      />

      {product.is_active === false && (
        <Heading
          bottom={12}
          left={2}
          color="gray.100"
          fontSize="xs"
          fontFamily="heading"
          position="absolute"
          textTransform="uppercase"
        >
          Anúncio desativado
        </Heading>
      )}

      {!isMyAd && (
        <UserPhoto
          source={{
            uri: `${api.defaults.baseURL}/images/${product.user.avatar}`,
          }}
          size={6}
          borderWidth="1"
          borderColor="gray.100"
          position="absolute"
          top={1}
          left={1}
        />
      )}

      <Box
        rounded="full"
        px={2}
        py={0.5}
        bg={product.is_new === true ? 'blue.700' : 'gray.600'}
        position="absolute"
        top={1}
        right={1}
        opacity={product.is_active === false ? 0.5 : 1}
      >
        <Text
          fontSize="2xs"
          color="white"
          fontFamily="heading"
          textTransform="uppercase"
        >
          {product.is_new === true ? 'Novo' : 'Usado'}
        </Text>
      </Box>

      <Text
        fontSize="sm"
        color={product.is_active === false ? 'gray.400' : 'gray.600'}
        fontFamily="body"
        mt={1}
      >
        {product.name}
      </Text>
      <HStack>
        <Text
          fontSize="xs"
          color={product.is_active === false ? 'gray.400' : 'gray.700'}
          fontFamily="heading"
          alignSelf="flex-end"
        >
          R${' '}
        </Text>
        <Heading
          fontSize="md"
          color={product.is_active === false ? 'gray.400' : 'gray.700'}
          fontFamily="heading"
        >
          {product.price.toFixed(2).replace('.', ',')}
        </Heading>
      </HStack>
    </TouchableOpacity>
  )
}
