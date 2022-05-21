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
import * as WebBrowser from "expo-web-browser"
import React, { useEffect, VFC } from "react"
import { ScrollView, View } from "react-native"
import { signOut, useCurrentUser } from "src/auth"
import { useGQLClient } from "src/graphql"
import { toastError } from "src/toast"
import { useUpdateTab } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useClient, useQuery } from "urql"

export type AccountScreenParams = CommonStackParams & {
  Home: undefined
  SignIn: undefined
  SignUp: undefined
}

const Stack = createNativeStackNavigator<AccountScreenParams>()
export const AccountScreen: VFC<
  BottomTabScreenProps<RootTabs, "Account">
> = () => {
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
        isAdmin
        isStripeAccountOnboarded
        ...PersonCardFragment
      }
    }
  }
`)

export const MyStripeOnboardingLink = gql(/* GraphQL */ `
  query MyStripeOnboardingLink {
    me {
      id
      stripeOnboardingLink
    }
  }
`)

export const MyStripeAccountLoginLink = gql(/* GraphQL */ `
  query MyStripeAccountLoginLink {
    me {
      id
      stripeAccountLoginLink
    }
  }
`)

const HomeScreen: VFC<
  NativeStackScreenProps<AccountScreenParams, "Home">
> = () => {
  const tw = useTailwind()
  useUpdateTab()
  const user = useCurrentUser()
  const client = useClient()
  const resetClient = useGQLClient().resetClient

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
            secondary
            style={tw("w-full")}
            text="Sign out"
            onPress={() => {
              signOut()
              resetClient()
            }}
          />
        </View>
        <View style={tw("h-4")} />
        {!!details && (
          <View style={tw("w-full max-w-md")}>
            <PersonCard person={details} />
          </View>
        )}
        <View style={tw("pt-4 w-full")}>
          {details?.isStripeAccountOnboarded ? (
            <MainButton
              secondary
              style={tw("w-full")}
              text="Payments Dashboard"
              onPress={async () => {
                const stripeAccountLoginLink = (
                  await client
                    .query(MyStripeAccountLoginLink, undefined, {
                      requestPolicy: "network-only",
                    })
                    .toPromise()
                ).data?.me?.stripeAccountLoginLink
                if (!stripeAccountLoginLink) return
                WebBrowser.openBrowserAsync(stripeAccountLoginLink)
              }}
            />
          ) : (
            <MainButton
              secondary
              style={tw("w-full")}
              text="Complete registration to accept payments through the app"
              onPress={async () => {
                const stripeOnboardingLink = (
                  await client
                    .query(MyStripeOnboardingLink, undefined, {
                      requestPolicy: "network-only",
                    })
                    .toPromise()
                ).data?.me?.stripeOnboardingLink
                if (!stripeOnboardingLink) {
                  toastError()
                  return
                }
                WebBrowser.openBrowserAsync(stripeOnboardingLink)
              }}
            />
          )}
        </View>
      </ScrollView>
    </MediumListWidth>
  )
}
