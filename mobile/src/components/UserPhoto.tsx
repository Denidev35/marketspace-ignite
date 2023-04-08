import { Image, IImageProps } from 'native-base'

type Props = IImageProps & {
  size: number
}

export function UserPhoto({ size, ...rest }: Props) {
  return (
    <Image
      w={size}
      h={size}
      rounded="full"
      borderWidth={3}
      borderColor="blue.500"
      alt="Foto do usuário"
      {...rest}
    />
  )
}
