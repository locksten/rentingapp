import { AppFlatList } from "@components/AppFlatList"
import { AppText } from "@components/AppText"
import { EmptyListIndicator } from "@components/EmptyListIndicator"
import { ListingListItem } from "@components/ListingListItem"
import { MainButton } from "@components/MainButton"
import { MediumListWidth } from "@components/MediumListWidth"
import { PersonLine } from "@components/PersonLine"
import { Pill } from "@components/Pill"
import { RentingPeriod } from "@components/RentingPeriod"
import { RootTabs } from "@components/RootTabNavigator"
import { SeparatedBy } from "@components/SeparatedBy"
import {
  CommonStackNavigationProp,
  CommonStackParams,
  WithCommonStackScreens,
} from "@components/WithCommonStackScreens"
import { DocumentType, gql } from "@gql/gql"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { View } from "react-native"
import { filterNodes, sortedByUpdatedAt, useRefetchOnFocus } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation, useQuery } from "urql"

export type MyListingsScreenParams = CommonStackParams & {
  Home: undefined
}

const Stack = createNativeStackNavigator<MyListingsScreenParams>()
export const MyListingsScreen: VFC<
  BottomTabScreenProps<RootTabs, "MyListings">
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

export const MyListings = gql(/* GraphQL */ `
  query MyListings {
    me {
      id
      myListings {
        edges {
          node {
            __typename
            id
            updatedAt
            ...ListingListItemFragment
            rentings {
              __typename
              id
              updatedAt
              ...OwnerRentingFragment
            }
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
  const [{ data, error }, refetch] = useQuery({
    query: MyListings,
    requestPolicy: "cache-and-network",
  })
  useRefetchOnFocus(refetch)
  const items = data?.me?.myListings?.edges

  if (error) return <AppText>Error {error.message}</AppText>

  const createListing = (
    <View style={tw("px-4 py-4")}>
      <MainButton
        text="New Listing"
        onPress={() => {
          navigate("CreateListing")
        }}
      />
    </View>
  )

  return (
    <MediumListWidth>
      <AppFlatList
        ListHeaderComponent={createListing}
        contentContainerStyle={tw("flex-grow")}
        ListEmptyComponent={EmptyListIndicator}
        data={sortedByUpdatedAt(filterNodes(items)?.map((i) => i.node))}
        renderItem={({ item }) => (
          <ListingListItem.ListItemVertical
            item={item}
            renderStatus={() => (
              <MainButton
                secondary
                text="Update Availability"
                toCommon={{
                  screen: "UpdateAvailability",
                  params: { listingId: item.id },
                }}
              />
            )}
            renderStatuses={() => {
              return (
                <View>
                  <SeparatedBy separator={<View style={tw("h-2")} />} start>
                    {sortedByUpdatedAt(item.rentings)?.map((renting) => (
                      <OwnerRenting key={renting.id} renting={renting} />
                    ))}
                  </SeparatedBy>
                </View>
              )
            }}
          />
        )}
        keyExtractor={(i) => i.id}
      />
    </MediumListWidth>
  )
}

const OwnerRentingFragment = gql(/* GraphQL */ `
  fragment OwnerRentingFragment on Renting {
    __typename
    id
    rentingStatus
    scheduledStartTime
    scheduledEndTime
    ownerFeedback {
      __typename
      id
    }
    updatedAt
    renter {
      __typename
      id
      ...PersonLineFragment
    }
  }
`)

export const declineRentingRequest = gql(/* GraphQL */ `
  mutation declineRentingRequest($input: DeclineRentingRequestInput!) {
    declineRentingRequest(input: $input) {
      __typename
      rentingStatus
      updatedAt
      id
    }
  }
`)

export const acceptRentingRequest = gql(/* GraphQL */ `
  mutation acceptRentingRequest($input: AcceptRentingRequestInput!) {
    acceptRentingRequest(input: $input) {
      __typename
      rentingStatus
      updatedAt
      id
    }
  }
`)

export const acceptRentingReturn = gql(/* GraphQL */ `
  mutation acceptRentingReturn($input: AcceptRentingReturnInput!) {
    acceptRentingReturn(input: $input) {
      __typename
      rentingStatus
      updatedAt
      id
    }
  }
`)

export const settleRentingOutsideApp = gql(/* GraphQL */ `
  mutation settleRentingOutsideApp($input: SettleRentingOutsideAppInput!) {
    settleRentingOutsideApp(input: $input) {
      __typename
      rentingStatus
      updatedAt
      id
    }
  }
`)

export const OwnerRenting: VFC<{
  renting?: DocumentType<typeof OwnerRentingFragment> | null
}> = ({ renting }) => {
  const tw = useTailwind()

  const [_, declineRequest] = useMutation(declineRentingRequest)
  const [__, acceptRequest] = useMutation(acceptRentingRequest)
  const [___, acceptReturn] = useMutation(acceptRentingReturn)
  const [____, settleOutsideApp] = useMutation(settleRentingOutsideApp)

  if (!renting) return null
  const { id: rentingId, renter, rentingStatus, ownerFeedback } = renting

  const status = {
    RequestPending: (
      <View style={tw("flex-row")}>
        <MainButton
          secondary
          text="Decline"
          onPress={() => {
            declineRequest({ input: { rentingId } })
          }}
        />
        <View style={tw("w-1")} />
        <MainButton
          text="Accept"
          onPress={() => {
            acceptRequest({ input: { rentingId } })
          }}
        />
      </View>
    ),
    RequestDeclined: <Pill color="gray">Declined</Pill>,
    PaymentPending: (
      <View style={tw("flex-row items-center")}>
        <Pill color="green">Awaiting Payment</Pill>
        {!ownerFeedback && (
          <View style={tw("pl-2")}>
            <MainButton
              text="Settle Outside App"
              onPress={async () => {
                await settleOutsideApp({ input: { rentingId } })
              }}
            />
          </View>
        )}
      </View>
    ),
    ReturnPending: (
      <MainButton
        text="Confirm Returned"
        onPress={async () => {
          await acceptReturn({ input: { rentingId } })
        }}
      />
    ),
    Returned: (
      <View style={tw("flex-row items-center")}>
        <Pill color="green">Returned</Pill>
        {!ownerFeedback && (
          <View style={tw("pl-2")}>
            <MainButton
              text="Leave Feedback"
              toCommon={{ screen: "LeaveFeedback", params: { rentingId } }}
            />
          </View>
        )}
      </View>
    ),
    Canceled: <Pill color="gray">Canceled</Pill>,
  }

  return (
    <View
      style={[
        (rentingStatus === "Canceled" ||
          rentingStatus === "RequestDeclined" ||
          (rentingStatus === "Returned" && renting.ownerFeedback)) &&
          tw("opacity-50"),
      ]}
    >
      <View style={tw("flex-row items-center justify-between")}>
        <PersonLine person={renter} pfpLeft />
        <View style={tw("w-1")} />
        <RentingPeriod renting={renting} />
      </View>
      <View style={tw("h-1")} />
      <View style={tw("flex-row justify-between items-center")}>
        <View style={tw("w-2")} />
        {rentingStatus && status[rentingStatus]}
      </View>
    </View>
  )
}
