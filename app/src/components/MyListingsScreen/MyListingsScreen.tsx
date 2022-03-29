import { AppText } from "@components/AppText"
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

// export const Listings = gql(/* GraphQL */ `
//   query Listings {
//     listings {
//       edges {
//         node {
//           __typename
//           id
//           ...ListingListItemFragment
//         }
//       }
//     }
//   }
// `)

const HomeScreen: VFC<
  NativeStackScreenProps<MyListingsScreenParams, "Home">
> = () => {
  return <AppText>MyListings Home</AppText>
}
