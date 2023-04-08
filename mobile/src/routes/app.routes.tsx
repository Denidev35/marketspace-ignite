import {
  createBottomTabNavigator,
  BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs'
import { AdDetails } from '@screens/AdDetails'
import { EditAd } from '@screens/EditAd'
import { Home } from '@screens/Home'
import { MyAdDetails } from '@screens/MyAdDetails'
import { MyAds } from '@screens/MyAds'
import { NewAd } from '@screens/NewAd'
import { PreviewAd } from '@screens/PreviewAd'
import { SignOut as SignOutScreen } from '@screens/SignOut'
import { useTheme } from 'native-base'
import { House, SignOut, Tag } from 'phosphor-react-native'
import { Platform } from 'react-native'

type AppRoutesProps = {
  home: undefined
  myAds: undefined
  signOut: undefined
  adDetails: {
    productId: string
  }
  editAd: {
    productId?: string
  }
  newAd: undefined
  previewAd: {
    productId: string
  }
  myAdDetails: {
    productId: string
  }
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutesProps>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutesProps>()

export function AppRoutes() {
  const { sizes, colors } = useTheme()

  const iconSize = sizes[6]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gray[600],
        tabBarInactiveTintColor: colors.gray[400],
        tabBarStyle: {
          backgroundColor: colors.gray[100],
          borderTopWidth: 0,
          height: Platform.OS === 'android' ? 'auto' : 96,
          paddingBottom: sizes[10],
          paddingTop: sizes[6],
        },
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <House
              size={iconSize}
              color={color}
              weight={focused ? 'bold' : 'regular'}
            />
          ),
        }}
      />
      <Screen
        name="myAds"
        component={MyAds}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Tag
              size={iconSize}
              color={color}
              weight={focused ? 'bold' : 'regular'}
            />
          ),
        }}
      />
      <Screen
        name="signOut"
        component={SignOutScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <SignOut
              size={iconSize}
              color={'#E07878'}
              weight={focused ? 'bold' : 'regular'}
            />
          ),
        }}
      />
      <Screen
        name="adDetails"
        component={AdDetails}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Screen
        name="editAd"
        component={EditAd}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Screen
        name="newAd"
        component={NewAd}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Screen
        name="previewAd"
        component={PreviewAd}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Screen
        name="myAdDetails"
        component={MyAdDetails}
        options={{
          tabBarButton: () => null,
          tabBarStyle: { display: 'none' },
        }}
      />
    </Navigator>
  )
}
