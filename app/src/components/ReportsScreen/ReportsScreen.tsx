import { AccountScreenParams } from "@components/AccountScreen"
import { AppFlatList } from "@components/AppFlatList"
import { FeedbackListItem } from "@components/FeedbackListItem"
import { ListingListItem } from "@components/ListingListItem"
import { MediumListWidth } from "@components/MediumListWidth"
import { Reports } from "@components/Reports/Reports"
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
import { View } from "react-native"
import { filterNodes, sortedByUpdatedAt, useRefetchOnFocus } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

export type ReportsScreenParams = CommonStackParams & {
  Home: undefined
}

const Stack = createNativeStackNavigator<ReportsScreenParams>()
export const ReportsScreen: VFC<
  BottomTabScreenProps<RootTabs, "Account">
> = () => {
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

export const ReportedListings = gql(/* GraphQL */ `
  query ReportedListings {
    reportedListings {
      edges {
        node {
          id
          __typename
          updatedAt
          ...ListingListItemFragment
          reports {
            id
            __typename
            ...ReportFragment
          }
        }
      }
    }
  }
`)

export const ReportedFeedbacks = gql(/* GraphQL */ `
  query ReportedFeedbacks {
    reportedFeedbacks {
      edges {
        node {
          id
          __typename
          updatedAt
          ...FeedbackListItemFragment
          reports {
            id
            __typename
            ...ReportFragment
          }
        }
      }
    }
  }
`)

const HomeScreen: VFC<
  NativeStackScreenProps<AccountScreenParams, "Home">
> = () => {
  const tw = useTailwind()

  const [listingsQuery, refetchListings] = useQuery({
    query: ReportedListings,
    requestPolicy: "cache-and-network",
  })
  const [feedbacksQuery, refetchFeedbacks] = useQuery({
    query: ReportedFeedbacks,
    requestPolicy: "cache-and-network",
  })
  useRefetchOnFocus(refetchListings)
  useRefetchOnFocus(refetchFeedbacks)
  const listingItems = listingsQuery?.data?.reportedListings?.edges
  const feedbackItems = feedbacksQuery?.data?.reportedFeedbacks?.edges

  if (!listingItems && !feedbackItems) return <></>
  const items = [...(listingItems ?? []), ...(feedbackItems ?? [])]
  return (
    <MediumListWidth>
      <AppFlatList
        data={sortedByUpdatedAt(filterNodes(items)?.map((i) => i.node))}
        renderItem={({ item }) => (
          <View style={tw("py-2")}>
            {item.__typename === "Feedback" && (
              <FeedbackListItem feedback={item} disableTouchable />
            )}
            {item.__typename === "Listing" && (
              <View style={tw("py-4 bg-white")}>
                <ListingListItem.ListItemVertical item={item} />
              </View>
            )}
            {!!item.reports && (
              <Reports
                reports={item.reports}
                listingId={item.__typename === "Listing" ? item.id : undefined}
                feedbackId={
                  item.__typename === "Feedback" ? item.id : undefined
                }
              />
            )}
          </View>
        )}
        keyExtractor={(i) => i.id}
      />
    </MediumListWidth>
  )
}
