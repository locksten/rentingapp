import "@expo/match-media"
import { RootTabNavigator } from "@components/RootTabNavigator"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import React, { VFC } from "react"
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { GraphQLProvider } from "src/graphql"
import { TailwindProvider, useTailwind } from "tailwind-rn"
import utilities from "tailwind.json"

export const AppRoot: VFC = () => {
  return (
    <GraphQLProvider>
      <TailwindProvider utilities={utilities}>
        <SafeAreaProvider>
          <Navigation />
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
  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style="auto" />
      <SafeAreaView style={{ flex: 1 }}>
        <RootTabNavigator />
      </SafeAreaView>
    </NavigationContainer>
  )
}
