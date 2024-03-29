import { RootTabNavigator, RootTabs } from "@components/RootTabNavigator"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import "@expo/match-media"
import {
  DefaultTheme,
  NavigationContainer,
  PathConfigMap,
} from "@react-navigation/native"
import * as Linking from "expo-linking"
import { StatusBar } from "expo-status-bar"
import React, { useEffect, useState, VFC } from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { onAuthStateChange } from "src/auth"
import { GraphQLProvider } from "src/graphql"
import { TailwindProvider, useTailwind } from "tailwind-rn"
import utilities from "tailwind.json"
import { StripeProvider as _StripeProvider } from "@stripe/stripe-react-native"
import type { Props as StripeProviderProps } from "@stripe/stripe-react-native/lib/typescript/src/components/StripeProvider"
const StripeProvider = _StripeProvider as React.FC<StripeProviderProps>

export const AppRoot: VFC = () => {
  const [authIsInitialized, setAuthIsInitialized] = useState(false)
  useEffect(() => {
    onAuthStateChange(() => {
      setAuthIsInitialized(true)
    })
  }, [])
  return (
    <StripeProvider
      publishableKey="pk_test_51KVLEkIqIJMDgnKE7mVnBA8RDtkRNfYOCQCIEocwyCFfw7LPXgFXyU5ANKbZg8QvHLjbkZut9nqTGluvisSt21vj00cERnPHnK"
      urlScheme="rentingapp"
    >
      <GraphQLProvider>
        <TailwindProvider utilities={utilities}>
          <SafeAreaProvider>
            {authIsInitialized && <Navigation />}
          </SafeAreaProvider>
        </TailwindProvider>
      </GraphQLProvider>
    </StripeProvider>
  )
}

const Navigation: VFC = () => {
  const tw = useTailwind()
  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: tw("text-primary-500").color as string,
    },
  }

  const commonRoutes: (tab: string) => PathConfigMap<CommonStackParams> = (
    tab,
  ) => ({
    CreateListing: `${tab}/listing/create`,
    ListingDetail: `${tab}/listing/:id`,
    MakeRentingRequest: `${tab}/:id/request`,
    LeaveFeedback: `${tab}/:id/leave-feedback`,
    Feedback: `${tab}/feedback/:feedbackId`,
    MakeReport: `${tab}/make-report`,
    PayForRenting: `${tab}/:id/pay`,
    Profile: `${tab}/user/:userId`,
  })

  return (
    <NavigationContainer<RootTabs>
      theme={navigationTheme}
      linking={{
        prefixes: [Linking.createURL("/")],
        config: {
          screens: {
            Browse: {
              path: "",
              screens: {
                Home: "",
                Search: "search",
                ...commonRoutes(""),
              },
            },
            Messages: {
              screens: {
                Home: "messages",
                Chat: "messages/:conversationId",
                ...commonRoutes("messages"),
              },
            },
            MyRentals: {
              screens: {
                Home: "my-rentals",
                ...commonRoutes("my-rentals"),
              },
            },
            MyListings: {
              screens: {
                Home: "my-listings",
                ...commonRoutes("my-listings"),
              },
            },
            Reports: {
              screens: {
                Home: "reports",
                ...commonRoutes("reports"),
              },
            },
            Account: {
              screens: {
                Home: "account",
                SignIn: "sign-in",
                SignUp: "sign-up",
                ...commonRoutes("account"),
              },
            },
          },
        },
      }}
    >
      <StatusBar style="auto" />
      <SafeAreaView style={tw("flex-1")}>
        <RootTabNavigator />
      </SafeAreaView>
    </NavigationContainer>
  )
}
