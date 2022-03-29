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

export type MyRentalsScreenParams = CommonStackParams & {
  Home: undefined
}

export const MyRentalsScreen: VFC<
  BottomTabScreenProps<RootTabs, "MyRentals">
> = () => {
  const Stack = createNativeStackNavigator<MyRentalsScreenParams>()
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
  NativeStackScreenProps<MyRentalsScreenParams, "Home">
> = () => <AppText>MyRentals Home</AppText>
