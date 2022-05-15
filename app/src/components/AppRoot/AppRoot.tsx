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

export const AppRoot: VFC = () => {
  const [authIsInitialized, setAuthIsInitialized] = useState(false)
  useEffect(() => {
    onAuthStateChange(() => {
      setAuthIsInitialized(true)
    })
  }, [])
  return (
    <GraphQLProvider>
      <TailwindProvider utilities={utilities}>
        <SafeAreaProvider>
          {authIsInitialized && <Navigation />}
        </SafeAreaProvider>
      </TailwindProvider>
    </GraphQLProvider>
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
    PayForRenting: `${tab}/:id/pay`,
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
            Account: {
              screens: {
                Home: "account",
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
