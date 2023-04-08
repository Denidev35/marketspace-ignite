import { HStack, Text } from 'native-base'
import { Bank, Barcode, CreditCard, Money, QrCode } from 'phosphor-react-native'

type Props = {
  method: string
}

export function PaymentMethod({ method }: Props) {
  return (
    <HStack mt={2} alignItems="center">
      {
        {
          Boleto: <Barcode size={18} color="#1A181B" />,
          Pix: <QrCode size={18} color="#1A181B" />,
          Dinheiro: <Money size={18} color="#1A181B" />,
          'Cartão de Crédito': <CreditCard size={18} color="#1A181B" />,
          'Depósito Bancário': <Bank size={18} color="#1A181B" />,
        }[method]
      }
      <Text fontSize="sm" fontFamily="body" color="gray.600" ml={2}>
        {method}
      </Text>
    </HStack>
  )
}
