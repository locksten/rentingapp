import { AppFlatList } from "@components/AppFlatList"
import { AppText } from "@components/AppText"
import { EmptyListIndicator } from "@components/EmptyListIndicator"
import { ListingListItem } from "@components/ListingListItem"
import { MainButton } from "@components/MainButton"
import { RootTabs } from "@components/RootTabNavigator"
import { SearchScreen } from "@components/SearchScreen"
import { SeparatedBy } from "@components/SeparatedBy"
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
import React, { useEffect, useState, VFC } from "react"
import { RefreshControl, ScrollView, View } from "react-native"
import { filterNodes, sortedByUpdatedAt, useUpdateTab } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

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

export const Listings = gql(/* GraphQL */ `
  query Listings {
    listings {
      edges {
        node {
          __typename
          id
          updatedAt
          ...ListingListItemFragment
        }
      }
    }
  }
`)

const HomeScreen: VFC<
  NativeStackScreenProps<BrowseScreenParams, "Home">
> = () => {
  useUpdateTab()
  const tw = useTailwind()

  const [{ data, fetching, error }, refetch] = useQuery({
    query: Listings,
    requestPolicy: "cache-and-network",
  })

  const items = data?.listings?.edges

  const [refreshing, setRefreshing] = useState(false)
  useEffect(() => {
    setRefreshing(fetching)
  }, [fetching])

  if (error) return <AppText>Error {error.message}</AppText>

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            refetch({ requestPolicy: "network-only" })
          }}
        />
      }
    >
      <SeparatedBy separator={<View style={tw("h-4")} />} start end>
        <View style={tw("px-4")}>
          <MainButton
            text="Search"
            to={{ screen: "Browse", params: { screen: "Search" } }}
          />
        </View>
        <AppFlatList
          horizontal
          ListEmptyComponent={EmptyListIndicator}
          title="Listings"
          data={sortedByUpdatedAt(filterNodes(items)?.map((i) => i.node))}
          renderItem={({ item }) => (
            <ListingListItem.ListItemHorizontal item={item} />
          )}
          keyExtractor={(i) => i.id}
        />
        {/* <AppFlatList
          horizontal
          title="Listings"
          data={sortedByUpdatedAt(filterNodes(items)?.map((i) => i.node))}
          renderItem={({ item }) => (
            <ListingListItem.ListItemHorizontal item={item} />
          )}
          keyExtractor={(i) => i.id}
        /> */}
      </SeparatedBy>
    </ScrollView>
  )
}
