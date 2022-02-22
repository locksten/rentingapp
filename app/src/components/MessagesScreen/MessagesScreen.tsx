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
import { Text } from "react-native"

export type MessagesScreenParams = CommonStackParams & {
  Home: undefined
}

export const MessagesScreen: VFC<
  BottomTabScreenProps<RootTabs, "Messages">
> = () => {
  const Stack = createNativeStackNavigator<MessagesScreenParams>()
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
  NativeStackScreenProps<MessagesScreenParams, "Home">
> = () => <Text>Messages Home</Text>
