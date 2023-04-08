/* eslint-disable array-callback-return */
import { api } from '@services/api'
import { Box, FlatList, HStack, Heading, Image } from 'native-base'
import { useState } from 'react'
import { Dimensions } from 'react-native'

type ProductsImageDTO = {
  id: string
  path: string
}

type Props = {
  data: ProductsImageDTO[]
  isActive?: boolean
}

export function Carousel({ data, isActive = true }: Props) {
  const [activeIndex, setActiveIndex] = useState(0)
  const width = Dimensions.get('window').width
  return (
    <Box>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image
            source={{
              uri: `${api.defaults.baseURL}/images/${item.path}`,
            }}
            alt="Imagem do anúncio"
            height={280}
            resizeMode="cover"
            width={width}
            bg="gray.700"
            opacity={isActive === false ? 0.5 : 1}
          />
        )}
        maxHeight={280}
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        width="full"
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x
          setActiveIndex(Math.ceil(x / width))
        }}
      />
      {isActive === false && (
        <Heading
          bottom={150}
          alignSelf="center"
          color="gray.100"
          fontSize="xs"
          fontFamily="heading"
          position="absolute"
          textTransform="uppercase"
        >
          Anúncio desativado
        </Heading>
      )}
      <HStack
        position="absolute"
        bottom={-2}
        w="full"
        h={3}
        justifyContent="space-between"
        alignItems="center"
        padding={0.5}
      >
        {data.map((_, index) => {
          if (data.length > 1) {
            return (
              <Box
                key={index}
                w="1/2"
                h={1}
                bgColor="gray.100"
                opacity={0.5}
                rounded="full"
                flexShrink={1}
                mx={0.5}
              >
                {activeIndex === index && (
                  <Box h={1} rounded="full" bg="gray.100" />
                )}
              </Box>
            )
          }
        })}
      </HStack>
    </Box>
  )
}
