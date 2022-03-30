import { AppFlatList } from "@components/AppFlatList"
import { AppText } from "@components/AppText"
import { ListingListItem } from "@components/ListingListItem"
import { MainButton } from "@components/MainButton"
import { RootTabs } from "@components/RootTabNavigator"
import {
  CommonStackNavigationProp,
  CommonStackParams,
  WithCommonStackScreens,
} from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { View } from "react-native"
import { filterNodes } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
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
  const tw = useTailwind()
  const { navigate } = useNavigation<CommonStackNavigationProp>()
  const [{ data, fetching, error }] = useQuery({
    query: MyListings,
    requestPolicy: "cache-and-network",
  })
  const items = data?.me?.MyListings?.edges

  if (fetching) return <AppText>Loading</AppText>
  if (error) return <AppText>Error {error.message}</AppText>

  return (
    <View style={tw("pt-4")}>
      <View style={tw("px-4 pb-4")}>
        <MainButton
          text="New Listing"
          onPress={() => {
            navigate("CreateListing")
          }}
        />
      </View>
      <AppFlatList
        title="MyListings"
        data={filterNodes(items)?.map((i) => i.node)}
        renderItem={({ item }) => (
          <ListingListItem.ListItemVertical item={item} />
        )}
        keyExtractor={(i) => i.id}
      />
    </View>
  )
}
