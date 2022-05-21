import { ListingList } from "@components/ListingList"
import { MainButton } from "@components/MainButton"
import { RootTabs } from "@components/RootTabNavigator"
import { SearchScreen } from "@components/SearchScreen"
import { SeparatedBy } from "@components/SeparatedBy"
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
import { ScrollView, View } from "react-native"
import { useUpdateTab } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"

export type BrowseScreenParams = CommonStackParams & {
  Home: undefined
  Search: undefined
}

const Stack = createNativeStackNavigator<BrowseScreenParams>()
export const BrowseScreen: VFC<
  BottomTabScreenProps<RootTabs, "Browse">
> = () => {
  return (
    <WithCommonStackScreens stack={Stack}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen name="Search" component={SearchScreen} />
    </WithCommonStackScreens>
  )
}

const HomeScreen: VFC<
  NativeStackScreenProps<BrowseScreenParams, "Home">
> = () => {
  useUpdateTab()
  const tw = useTailwind()

  return (
    <ScrollView>
      <SeparatedBy separator={<View style={tw("h-2")} />} start end>
        <View style={tw("px-4")}>
          <MainButton
            text="Search"
            to={{ screen: "Browse", params: { screen: "Search" } }}
          />
        </View>
        <ListingList category="All Categories" />
        <ListingList category="Camping Gear" />
        <ListingList category="Tools" />
        <ListingList category="Music Gear" />
        <ListingList category="Toys & Games" />
      </SeparatedBy>
    </ScrollView>
  )
}
