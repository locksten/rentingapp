import { AppText } from "@components/AppText"
import { MainButton } from "@components/MainButton"
import { RootTabs } from "@components/RootTabNavigator"
import { SignIn } from "@components/SignInScreen"
import { SignUp } from "@components/SignUpScreen"
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
import { View } from "react-native"
import { signOut, useCurrentUser } from "src/auth"
import { useTailwind } from "tailwind-rn/dist"

export type AccountScreenParams = CommonStackParams & {
  Home: undefined
  SignIn: undefined
  SignUp: undefined
}

export const AccountScreen: VFC<
  BottomTabScreenProps<RootTabs, "Account">
> = () => {
  const Stack = createNativeStackNavigator<AccountScreenParams>()
  const user = useCurrentUser()
  return (
    <WithCommonStackScreens stack={Stack}>
      {user ? (
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={HomeScreen}
        />
      ) : (
        <Stack.Group>
          <Stack.Screen
            options={{ title: "Sign In" }}
            name="SignIn"
            component={SignIn}
          />
          <Stack.Screen
            options={{ title: "Sign Up" }}
            name="SignUp"
            component={SignUp}
          />
        </Stack.Group>
      )}
    </WithCommonStackScreens>
  )
}

const HomeScreen: VFC<
  NativeStackScreenProps<AccountScreenParams, "Home">
> = () => {
  const tw = useTailwind()
  const user = useCurrentUser()
  if (!user) <AppText>Something went wrong</AppText>
  return (
    <View style={tw("flex-1 px-4")}>
      <MainButton text="Sign out" onPress={signOut} />
      <AppText>{user?.displayName}</AppText>
    </View>
  )
}
