import { HorizontalFlatList } from "@components/HorizontalFlatList"
import { ListingListItem } from "@components/ListingListItem"
import { RootTabs } from "@components/RootTabNavigator"
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
import { useTailwind } from "tailwind-rn/dist"

export type BrowseScreenParams = CommonStackParams & {
  Home: undefined
}

export const BrowseScreen: VFC<
  BottomTabScreenProps<RootTabs, "Browse">
> = () => {
  const Stack = createNativeStackNavigator<BrowseScreenParams>()
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
  NativeStackScreenProps<BrowseScreenParams, "Home">
> = () => {
  const tw = useTailwind()
  return (
    <ScrollView>
      <SeparatedBy separator={<View style={tw("h-8")} />} start end>
        <HorizontalFlatList
          title="Electronics"
          data={[...Array(7).keys()].map((i) => ({
            id: `${i}`,
          }))}
          renderItem={({ item }) => <ListingListItem item={item} />}
          keyExtractor={(i) => i.id}
        />
        <HorizontalFlatList
          title="Outdoor Gear"
          data={[...Array(7).keys()].map((i) => ({
            id: `${i}`,
          }))}
          renderItem={({ item }) => <ListingListItem item={item} />}
          keyExtractor={(i) => i.id}
        />
      </SeparatedBy>
    </ScrollView>
  )
}
