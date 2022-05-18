import { AppText } from "@components/AppText"
import { MainButton } from "@components/MainButton"
import { MediumListWidth } from "@components/MediumListWidth"
import { PersonCard } from "@components/PersonCard"
import { RootTabs } from "@components/RootTabNavigator"
import { SignIn } from "@components/SignInScreen"
import { SignUp } from "@components/SignUpScreen"
import {
  CommonStackParams,
  WithCommonStackScreens,
} from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import React, { useEffect, VFC } from "react"
import { ScrollView, View } from "react-native"
import { signOut, useCurrentUser } from "src/auth"
import { useGQLClient } from "src/graphql"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

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

export const MyAccountDetails = gql(/* GraphQL */ `
  query MyAccountDetails {
    me {
      id
      user {
        id
        isMe
        ...PersonCardFragment
      }
    }
  }
`)

const HomeScreen: VFC<
  NativeStackScreenProps<AccountScreenParams, "Home">
> = () => {
  const tw = useTailwind()
  const user = useCurrentUser()
  const gqlClient = useGQLClient()

  const [{ data, error }, refetch] = useQuery({
    query: MyAccountDetails,
    requestPolicy: "cache-and-network",
    pause: !user,
  })
  const details = data?.me?.user

  useEffect(() => {
    const t = setTimeout(() => {
      refetch()
    }, 1000)
    return () => {
      clearTimeout(t)
    }
  }, [])

  if (error || !user || !details) <AppText>Something went wrong</AppText>
  return (
    <MediumListWidth>
      <ScrollView style={tw("px-4")} contentContainerStyle={tw("items-center")}>
        <View style={tw("h-4")} />
        <View style={tw("w-full")}>
          <MainButton
            style={tw("flex-1")}
            text="Sign out"
            onPress={() => {
              signOut()
              gqlClient.resetClient()
            }}
          />
        </View>
        <View style={tw("h-4")} />
        <View style={tw("w-full max-w-md")}>
          {!!details && <PersonCard person={details} />}
        </View>
      </ScrollView>
    </MediumListWidth>
  )
}
