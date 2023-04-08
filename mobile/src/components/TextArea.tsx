import { TextArea as TextAreaBaseNative, ITextAreaProps } from 'native-base'

type Props = ITextAreaProps & {}

export function TextArea({ ...rest }: Props) {
  return (
    <TextAreaBaseNative
      bg="gray.100"
      h={40}
      w="full"
      mt={4}
      rounded="lg"
      borderWidth={0}
      fontSize="md"
      color="gray.600"
      fontFamily="body"
      placeholderTextColor="gray.400"
      px={4}
      _focus={{
        bg: 'gray.100',
        borderWidth: 1,
        borderColor: 'gray.500',
      }}
      autoCompleteType
      {...rest}
    />
  )
}
