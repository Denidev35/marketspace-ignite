import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import { Box, useTheme } from 'native-base'

import { useAuth } from '@hooks/useAuth'
import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'
import { Loading } from '@components/Loading'

export function Routes() {
  const { colors } = useTheme()
  const { user, isLoadingUseStorageData } = useAuth()

  const theme = DefaultTheme
  theme.colors.background = colors.gray[200]

  if (isLoadingUseStorageData) {
    return <Loading />
  }

  return (
    <Box flex={1} bg="gray.200">
      <NavigationContainer>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  )
}
