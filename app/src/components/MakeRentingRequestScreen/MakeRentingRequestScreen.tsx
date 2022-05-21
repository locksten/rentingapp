import { AppText } from "@components/AppText"
import {
  CalendarRangeSelect,
  useCalendarRangeSelect,
} from "@components/CalendarRangeSelect"
import { MainButton } from "@components/MainButton"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { SafeAreaView, View } from "react-native"
import { centsToEuroString } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation, useQuery } from "urql"

export const ListingRentalRequest = gql(/* GraphQL */ `
  query ListingRentalRequest($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on Listing {
        dayPriceEuroCents
        unavailableDays
        owner {
          __typename
          id
          isStripeAccountOnboarded
        }
      }
    }
  }
`)

export const makeRentingRequest = gql(/* GraphQL */ `
  mutation makeRentingRequest($input: MakeRentingRequestInput!) {
    makeRentingRequest(input: $input) {
      __typename
      id
      rentingStatus
      updatedAt
    }
  }
`)

export const MakeRentingRequestScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "MakeRentingRequest">
> = ({
  route: {
    params: { id },
  },
}) => {
  const tw = useTailwind()
  const navigtion = useNavigation()
  const { rangeSelectCalendarProps, durationDays, start, end } =
    useCalendarRangeSelect()

  const [{ data }] = useQuery({
    query: ListingRentalRequest,
    variables: { nodeId: id },
    requestPolicy: "cache-and-network",
  })
  const item = data?.node?.__typename === "Listing" ? data.node : undefined

  const [_, makeRequest] = useMutation(makeRentingRequest)

  return (
    <SafeAreaView style={tw("flex-1 bg-white")}>
      <CalendarRangeSelect
        {...rangeSelectCalendarProps}
        disabledDates={item?.unavailableDays}
      />
      <View style={tw("p-2")}>
        {item?.owner && !item.owner.isStripeAccountOnboarded && (
          <View style={tw("p-2")}>
            <AppText style={tw("text-center")}>
              Owner cannot accept payments through the app
            </AppText>
          </View>
        )}
        <MainButton
          onPress={async () => {
            if (!(start && end)) return
            await makeRequest({
              input: {
                listingId: id,
                scheduledStartTime: start.toISOString(),
                scheduledEndTime: end.toISOString(),
              },
            })
            navigtion.goBack()
          }}
          text={
            durationDays && item?.dayPriceEuroCents
              ? `Request for ${
                  durationDays === 1 ? "a day" : `${durationDays} days`
                } for ${centsToEuroString(
                  item.dayPriceEuroCents * durationDays,
                )}€`
              : `Pick a Date`
          }
        />
      </View>
    </SafeAreaView>
  )
}
