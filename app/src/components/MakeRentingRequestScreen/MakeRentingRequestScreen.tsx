import {
  CalendarRangeSelect,
  useCalendarRangeSelect,
} from "@components/CalendarRangeSelect"
import { MainButton } from "@components/MainButton"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { SafeAreaView, View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation, useQuery } from "urql"

export const ListingRentalRequest = gql(/* GraphQL */ `
  query ListingRentalRequest($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on Listing {
        dayPriceEuroCents
      }
    }
  }
`)

export const makeRentingRequest = gql(/* GraphQL */ `
  mutation makeRentingRequest($input: MakeRentingRequestInput!) {
    makeRentingRequest(input: $input) {
      id
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
  const { rangeSelectCalendarProps, durationDays, start, end } =
    useCalendarRangeSelect()
  const [made, setMade] = useState(false)

  const [{ data }] = useQuery({
    query: ListingRentalRequest,
    variables: { nodeId: id },
    requestPolicy: "cache-and-network",
  })
  const item = data?.node?.__typename === "Listing" ? data.node : undefined

  const [_, makeRequest] = useMutation(makeRentingRequest)

  return (
    <SafeAreaView style={tw("flex-1 bg-white")}>
      <CalendarRangeSelect {...rangeSelectCalendarProps} />
      <View style={tw("p-2")}>
        {made ? (
          <MainButton
            secondary
            onPress={() => setMade(false)}
            text={"Cancel Request"}
          />
        ) : (
          <MainButton
            onPress={() => {
              start &&
                end &&
                makeRequest({
                  input: {
                    listingId: id,
                    scheduledStartTime: start.toISOString(),
                    scheduledEndTime: end.toISOString(),
                  },
                })
            }}
            text={
              durationDays && item?.dayPriceEuroCents
                ? `Request for ${
                    durationDays === 1 ? "a day" : `${durationDays} days`
                  } for ${(item.dayPriceEuroCents * durationDays) / 100}€`
                : `Pick a Date`
            }
          />
        )}
      </View>
    </SafeAreaView>
  )
}
