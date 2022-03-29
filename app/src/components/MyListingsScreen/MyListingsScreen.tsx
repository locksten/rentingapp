import { AppText } from "@components/AppText"
import { HorizontalFlatList } from "@components/HorizontalFlatList"
import { ListingListItem } from "@components/ListingListItem"
import { RootTabs } from "@components/RootTabNavigator"
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
import React, { VFC } from "react"
import { filterNodes } from "src/utils"
import { useQuery } from "urql"

export type MyListingsScreenParams = CommonStackParams & {
  Home: undefined
}

export const MyListingsScreen: VFC<
  BottomTabScreenProps<RootTabs, "MyListings">
> = () => {
  const Stack = createNativeStackNavigator<MyListingsScreenParams>()

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

export const MyListings = gql(/* GraphQL */ `
  query MyListings {
    me {
      id
      MyListings {
        edges {
          node {
            __typename
            id
            ...ListingListItemFragment
          }
        }
      }
    }
  }
`)

const HomeScreen: VFC<
  NativeStackScreenProps<MyListingsScreenParams, "Home">
> = () => {
  const [{ data, fetching, error }] = useQuery({
    query: MyListings,
    requestPolicy: "cache-and-network",
  })
  const items = data?.me?.MyListings?.edges

  if (fetching) return <AppText>Loading</AppText>
  if (error) return <AppText>Error {error.message}</AppText>

  return (
    <HorizontalFlatList
      title="MyListings"
      data={filterNodes(items)?.map((i) => i.node)}
      renderItem={({ item }) => <ListingListItem item={item} />}
      keyExtractor={(i) => i.id}
    />
  )
}
