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

export type MyRentalsScreenParams = CommonStackParams & {
  Home: undefined
}

export const MyRentalsScreen: VFC<
  BottomTabScreenProps<RootTabs, "MyRentals">
> = () => {
  const Stack = createNativeStackNavigator<MyRentalsScreenParams>()
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

export const MyRentals = gql(/* GraphQL */ `
  query MyRentals {
    me {
      id
      MyRentals {
        edges {
          node {
            __typename
            id
            scheduledStartTime
            scheduledEndTime
            rentingReturnStatus
            rentingRequestStatus
            rentingPaymentStatus
            listing {
              ...ListingListItemFragment
            }
          }
        }
      }
    }
  }
`)

const HomeScreen: VFC<
  NativeStackScreenProps<MyRentalsScreenParams, "Home">
> = () => {
  const tw = useTailwind()
  const { navigate } = useNavigation<CommonStackNavigationProp>()
  const [{ data, fetching, error }] = useQuery({
    query: MyRentals,
    requestPolicy: "cache-and-network",
  })
  const items = data?.me?.MyRentals?.edges

  if (fetching) return <AppText>Loading</AppText>
  if (error) return <AppText>Error {error.message}</AppText>

  return (
    <View style={tw("pt-4")}>
      <View style={tw("px-4")}>
        <MainButton
          text="New Listing"
          onPress={() => {
            navigate("CreateListing")
          }}
        />
      </View>
      <AppFlatList
        data={filterNodes(items)?.map((i) => i.node)}
        renderItem={({ item }) => (
          <ListingListItem.ListItemVertical
            item={item.listing!}
            renderStatus={() => (
              <MainButton
                secondary
                text={
                  item.rentingRequestStatus === "Pending" ? "Cancel" : "Status"
                }
                onPress={() => {}}
              />
            )}
          />
        )}
        keyExtractor={(i) => i.id}
      />
    </View>
  )
}
