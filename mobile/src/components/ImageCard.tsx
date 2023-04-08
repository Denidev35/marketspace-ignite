import { Image, IImageProps, Box, Pressable } from 'native-base'
import { XCircle } from 'phosphor-react-native'

type Props = IImageProps & {
  onRemoveImage: () => void
}

export function ImageCard({ onRemoveImage, ...rest }: Props) {
  return (
    <Box mt={4} width={100} mr={2}>
      <Image
        alt="imagens do anúncio"
        width={100}
        height={100}
        backgroundColor="#D9D8DA"
        borderRadius={6}
        {...rest}
      />
      <Pressable position="absolute" right={1} top={1} onPress={onRemoveImage}>
        <XCircle size={16} weight="fill" color="#3E3A40" />
      </Pressable>
    </Box>
  )
}
