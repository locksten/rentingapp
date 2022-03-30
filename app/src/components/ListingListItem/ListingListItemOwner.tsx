import { AppText } from "@components/AppText"
import { ProfilePicture } from "@components/ProfilePicture"
import { DocumentType, gql } from "@gql/gql"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

const ListingListItemOwnerFragment = gql(/* GraphQL */ `
  fragment ListingListItemOwnerFragment on User {
    __typename
    id
    name
    imageUrl
    listingCount
  }
`)

export const ListingListItemOwner: VFC<{
  owner: DocumentType<typeof ListingListItemOwnerFragment>
}> = ({ owner: { name, imageUrl } }) => {
  const tw = useTailwind()
  return (
    <View style={tw("flex-row items-center")}>
      <AppText numberOfLines={1} style={tw("flex-shrink text-gray-600")}>
        {name}
      </AppText>
      <View style={tw("w-1")} />
      <ProfilePicture uri={imageUrl} style={tw("h-8")} />
    </View>
  )
}
