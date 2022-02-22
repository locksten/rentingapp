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

const items: ListingListItem[] = [
  {
    id: "1",
    imageUri:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "Some camera or something or other",
    cost: 5,
  },
  {
    id: "2",
    imageUri:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "Another camera",
    cost: 5,
  },
  {
    id: "3",
    imageUri:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "title",
    cost: 5,
  },
]

const items2: ListingListItem[] = [
  {
    id: "1",
    imageUri:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "Electra Townie Beach Cruiser Bike",
    cost: 5,
  },
  {
    id: "2",
    imageUri:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "title",
    cost: 5,
  },
  {
    id: "3",
    imageUri:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "title",
    cost: 5,
  },
]

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
          data={items}
          renderItem={({ item }) => <ListingListItem item={item} />}
        />
        <HorizontalFlatList
          title="Outdoor Gear"
          data={items2}
          renderItem={({ item }) => <ListingListItem item={item} />}
        />
      </SeparatedBy>
    </ScrollView>
  )
}
