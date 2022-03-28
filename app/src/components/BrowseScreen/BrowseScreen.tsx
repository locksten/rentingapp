import { AppText } from "@components/AppText"
import { HorizontalFlatList } from "@components/HorizontalFlatList"
import { ListingListItem } from "@components/ListingListItem"
import { RootTabs } from "@components/RootTabNavigator"
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
import React, { VFC } from "react"
import { ScrollView, View } from "react-native"
import { filterNodes } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

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

export const Listings = gql(/* GraphQL */ `
  query Listings {
    listings {
      edges {
        node {
          __typename
          id
          ...ListingListItemFragment
        }
      }
    }
  }
`)

const HomeScreen: VFC<
  NativeStackScreenProps<BrowseScreenParams, "Home">
> = () => {
  const tw = useTailwind()

  const [{ data, fetching, error }] = useQuery({
    query: Listings,
    requestPolicy: "cache-and-network",
  })

  const items = data?.listings?.edges

  if (fetching) return <AppText>Loading</AppText>
  if (error) return <AppText>Error {error.message}</AppText>

  return (
    <ScrollView>
      <SeparatedBy separator={<View style={tw("h-8")} />} start end>
        <HorizontalFlatList
          title="Listings"
          data={filterNodes(items)?.map((i) => i.node)}
          renderItem={({ item }) => <ListingListItem item={item} />}
          keyExtractor={(i) => i.id}
        />
      </SeparatedBy>
    </ScrollView>
  )
}
