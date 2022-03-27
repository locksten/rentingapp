import { AppText } from "@components/AppText"
import { RootTabs } from "@components/RootTabNavigator"
import {
  CommonStackParams,
  WithCommonStackScreens,
} from "@components/WithCommonStackScreens"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import React, { VFC } from "react"

export type AccountScreenParams = CommonStackParams & {
  Home: undefined
}

export const AccountScreen: VFC<
  BottomTabScreenProps<RootTabs, "Account">
> = () => {
  const Stack = createNativeStackNavigator<AccountScreenParams>()
  return (
    <WithCommonStackScreens stack={Stack}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
    </WithCommonStackScreens>
  )
}

const HomeScreen: VFC<
  NativeStackScreenProps<AccountScreenParams, "Home">
> = () => <AppText>Account Home</AppText>
