import { AppText } from "@components/AppText"
import { ListingListItem } from "@components/ListingListItem"
import { MainButton } from "@components/MainButton"
import { PersonLine } from "@components/PersonLine"
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
import { FlatList, View } from "react-native"
import { filterNodes, sortByUpdatedAt, useRefetchOnFocus } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation, useQuery } from "urql"

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
            rentings {
              __typename
              id
              rentingStatus
              scheduledStartTime
              scheduledEndTime
              updatedAt
              renter {
                __typename
                id
                ...PersonLineFragment
              }
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
  const items = data?.me?.MyListings?.edges

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
    <FlatList
      ListHeaderComponent={items?.length ? createListing : undefined}
      contentContainerStyle={tw("flex-grow")}
      ListEmptyComponent={
        <View style={tw("flex-1 justify-center")}>{createListing}</View>
      }
      data={filterNodes(items)?.map((i) => i.node)}
      renderItem={({ item }) => (
        <ListingListItem.ListItemVertical
          item={item}
          renderStatus={() => <></>}
          renderStatuses={() => {
            return (
              <View>
                <SeparatedBy separator={<View style={tw("h-2")} />} start>
                  {sortByUpdatedAt(item.rentings)?.map((renting) => (
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
  )
}

const OwnerRentingFragment = gql(/* GraphQL */ `
  fragment OwnerRentingFragment on Renting {
    __typename
    id
    rentingStatus
    scheduledStartTime
    scheduledEndTime
    renter {
      __typename
      id
      ...PersonLineFragment
    }
  }
`)

export const declineRentingRequest = gql(/* GraphQL */ `
  mutation declineRentingRequest($input: DeclineRentingInput!) {
    declineRentingRequest(input: $input) {
      __typename
      rentingStatus
      id
    }
  }
`)

export const acceptRentingRequest = gql(/* GraphQL */ `
  mutation acceptRentingRequest($input: AcceptRentingInput!) {
    acceptRentingRequest(input: $input) {
      __typename
      rentingStatus
      id
    }
  }
`)

export const OwnerRenting: VFC<{
  renting?: DocumentType<typeof OwnerRentingFragment> | null
}> = ({ renting }) => {
  const [_, declineRequest] = useMutation(declineRentingRequest)
  const [__, acceptRequest] = useMutation(acceptRentingRequest)

  const tw = useTailwind()

  if (!renting) return null
  const { id: rentingId, renter, rentingStatus } = renting

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
    RequestDeclined: <AppText>Declined</AppText>,
    PaymentPending: <AppText>Awaiting Payment</AppText>,
    ReturnPending: (
      <MainButton
        text="Accept Return"
        onPress={() => {
          console.log("Navigate to leaave feedback")
          // acceptRequest({ input: { rentingId } })
        }}
      />
    ),
    Returned: <AppText>Returned</AppText>,
    Canceled: <AppText>Canceled</AppText>,
  }

  return (
    <View style={tw("flex-row justify-between items-center")}>
      <PersonLine person={renter} pfpLeft />
      <View style={tw("w-1")} />
      <View style={tw("flex-row items-center")}>
        <RentingPeriod renting={renting} />
        <View style={tw("w-2")} />
        {rentingStatus && status[rentingStatus]}
      </View>
    </View>
  )
}
