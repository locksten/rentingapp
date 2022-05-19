import { AppFlatList } from "@components/AppFlatList"
import { AppText } from "@components/AppText"
import { ListingListItem } from "@components/ListingListItem"
import { MediumListWidth } from "@components/MediumListWidth"
import { PersonCard } from "@components/PersonCard"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { View } from "react-native"
import { sortedByUpdatedAt } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

export const User = gql(/* GraphQL */ `
  query User($nodeId: ID!) {
    node(id: $nodeId) {
      ... on User {
        __typename
        id
        name
        ...PersonCardFragment
        listings {
          __typename
          id
          updatedAt
          ...ListingListItemFragment
        }
      }
    }
  }
`)

export const ProfileScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "Profile">
> = ({
  route: {
    params: { userId },
  },
}) => {
  const tw = useTailwind()

  const [{ data, error }] = useQuery({
    query: User,
    variables: { nodeId: userId },
    requestPolicy: "cache-and-network",
  })
  const person = data?.node?.__typename === "User" ? data.node : undefined
  const listings = person?.listings

  if (error || !person?.__typename)
    return <AppText>Error {error?.message}</AppText>

  return (
    <MediumListWidth>
      <AppFlatList
        ListHeaderComponent={
          <View style={tw("px-4 py-4 w-full max-w-md")}>
            <PersonCard person={person} disableTouchable />
          </View>
        }
        contentContainerStyle={tw("flex-grow")}
        data={listings ? sortedByUpdatedAt(listings) : []}
        renderItem={({ item }) => (
          <ListingListItem.ListItemVertical item={item} />
        )}
        keyExtractor={(i) => i.id}
      />
    </MediumListWidth>
  )
}
