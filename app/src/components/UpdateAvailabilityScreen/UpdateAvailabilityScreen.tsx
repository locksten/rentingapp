import { MainButton } from "@components/MainButton"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { formatISO } from "date-fns"
import { default as React, useEffect, useState, VFC } from "react"
import { SafeAreaView, View } from "react-native"
import { CalendarList } from "react-native-calendars"
import { useTailwind } from "tailwind-rn"
import { useMutation, useQuery } from "urql"

export const ListingAvailability = gql(/* GraphQL */ `
  query ListingAvailability($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on Listing {
        ownerUnavailableDays
      }
    }
  }
`)

export const UpdateListingUnavailableDates = gql(/* GraphQL */ `
  mutation updateListingUnavailableDates(
    $input: UpdateListingUnavailableDatesInput!
  ) {
    updateListingUnavailableDates(input: $input) {
      __typename
      id
      updatedAt
      ownerUnavailableDays
    }
  }
`)

export const UpdateAvailabilityScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "UpdateAvailability">
> = ({
  route: {
    params: { listingId },
  },
}) => {
  const tw = useTailwind()
  const navigtion = useNavigation()

  const [{ data }] = useQuery({
    query: ListingAvailability,
    variables: { nodeId: listingId },
    requestPolicy: "cache-and-network",
  })
  const item = data?.node?.__typename === "Listing" ? data.node : undefined

  const [dates, setDates] = useState(
    item?.ownerUnavailableDays?.map((d) => new Date(d)) ?? [],
  )

  useEffect(() => {
    setDates(item?.ownerUnavailableDays?.map((d) => new Date(d)) ?? [])
  }, [data])

  const [_, updateDates] = useMutation(UpdateListingUnavailableDates)

  return (
    <SafeAreaView style={tw("flex-1 bg-white")}>
      <View style={tw("flex-1")}>
        <AvailabilityCalendar dates={dates} onChange={setDates} />
      </View>
      <View style={tw("p-2")}>
        <MainButton
          onPress={async () => {
            await updateDates({
              input: {
                listingId,
                unavailableDates: dates.map((d) => d.toISOString()),
              },
            })
            navigtion.goBack()
          }}
          text="Save"
        />
      </View>
    </SafeAreaView>
  )
}

export const AvailabilityCalendar: VFC<{
  dates?: Date[]
  onChange: (vaule: Date[]) => void
}> = ({ dates = [], onChange }) => {
  const days = dates?.reduce(
    (obj, d) => ({
      ...obj,
      [formatISO(d, { representation: "date" })]: {
        selected: true,
        selectedColor: "#b91c1c",
      },
    }),
    {},
  )
  return (
    <CalendarList
      minDate={new Date().toISOString()}
      markedDates={{
        ...days,
      }}
      onDayPress={({ timestamp }) => {
        if (dates.find((d) => d.getTime() === timestamp)) {
          onChange(dates.filter((d) => d.getTime() !== timestamp))
        } else {
          onChange([new Date(timestamp), ...dates])
        }
      }}
      horizontal={true}
      pagingEnabled={true}
    />
  )
}
