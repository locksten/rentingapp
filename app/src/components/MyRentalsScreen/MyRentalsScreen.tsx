import { AppFlatList } from "@components/AppFlatList"
import { AppText } from "@components/AppText"
import { CancelRentingButton } from "@components/CancelRenting"
import { ListingListItem } from "@components/ListingListItem"
import { MainButton } from "@components/MainButton"
import { MediumListWidth } from "@components/MediumListWidth"
import { Pill } from "@components/Pill"
import { RentingPeriod } from "@components/RentingPeriod"
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
import { formatDistanceToNowStrict } from "date-fns"
import React, { VFC } from "react"
import { View } from "react-native"
import {
  filterNodes,
  parseJSONDate,
  sortByUpdatedAt,
  useRefetchOnFocus,
} from "src/utils"
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
            rentingStatus
            updatedAt
            renterFeedback {
              __typename
              id
            }
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
  const [{ data, error }, refetch] = useQuery({
    query: MyRentals,
    requestPolicy: "cache-and-network",
  })
  useRefetchOnFocus(refetch)
  const items = data?.me?.MyRentals?.edges

  if (error) return <AppText>Error {error.message}</AppText>

  return (
    <View style={tw("pt-4")}>
      <MediumListWidth>
        <AppFlatList
          data={sortByUpdatedAt(filterNodes(items)?.map((i) => i.node))}
          renderItem={({ item }) => {
            const endDate = parseJSONDate(item.scheduledEndTime)
            return (
              <ListingListItem.ListItemVertical
                item={item.listing!}
                renderStatus={() => <RentingPeriod renting={item} />}
                renderStatuses={() => {
                  const status = {
                    RequestPending: <CancelRentingButton rentingId={item.id} />,
                    RequestDeclined: <Pill color="red">Declined</Pill>,
                    PaymentPending: (
                      <View style={tw("flex-row")}>
                        <CancelRentingButton rentingId={item.id} />
                        <View style={tw("w-1")} />
                        <MainButton
                          text="Pay"
                          onPress={() => {
                            navigate("PayForRenting", { id: item.id })
                          }}
                        />
                      </View>
                    ),
                    ReturnPending: !!endDate && (
                      <Pill>
                        Return in{" "}
                        {formatDistanceToNowStrict(endDate, { unit: "day" })}
                      </Pill>
                    ),
                    Returned: (
                      <View style={tw("flex-row items-center")}>
                        <Pill color="green">Returned</Pill>
                        {!item.renterFeedback && (
                          <View style={tw("pl-2")}>
                            <MainButton
                              text="Leave Feedback"
                              onPress={() => {
                                navigate("LeaveFeedback", {
                                  rentingId: item.id,
                                })
                              }}
                            />
                          </View>
                        )}
                      </View>
                    ),
                    Canceled: <Pill color="gray">Canceled</Pill>,
                  }
                  return (
                    <View style={tw("flex-row items-center justify-end pt-2")}>
                      {item.rentingStatus && status[item.rentingStatus]}
                    </View>
                  )
                }}
              />
            )
          }}
          keyExtractor={(i) => i.id}
        />
      </MediumListWidth>
    </View>
  )
}
