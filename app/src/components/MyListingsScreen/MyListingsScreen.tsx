import { AppText } from "@components/AppText"
import { ListingListItem } from "@components/ListingListItem"
import { MainButton } from "@components/MainButton"
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

export const OwnerRenting: VFC<{
  renting?: DocumentType<typeof OwnerRentingFragment> | null
}> = ({ renting }) => {
  const tw = useTailwind()
  const { navigate } = useNavigation<CommonStackNavigationProp>()

  const [_, declineRequest] = useMutation(declineRentingRequest)
  const [__, acceptRequest] = useMutation(acceptRentingRequest)
  const [___, acceptReturn] = useMutation(acceptRentingReturn)

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
    PaymentPending: <Pill color="green">Awaiting Payment</Pill>,
    ReturnPending: (
      <MainButton
        text="Accept Return"
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
              onPress={() => {
                navigate("LeaveFeedback", { rentingId })
              }}
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
      <View style={tw("flex-row items-center")}>
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
