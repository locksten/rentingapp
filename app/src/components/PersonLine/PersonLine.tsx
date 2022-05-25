import { AppText } from "@components/AppText"
import { AppTouchable } from "@components/AppTouchable"
import { ProfilePicture } from "@components/ProfilePicture"
import { DocumentType, gql } from "@gql/gql"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

const PersonLineFragment = gql(/* GraphQL */ `
  fragment PersonLineFragment on User {
    __typename
    id
    name
    imageUrl
    listingCount
  }
`)

export const PersonLine: VFC<{
  person?: DocumentType<typeof PersonLineFragment> | null
  pfpLeft?: boolean
}> = ({ person, pfpLeft }) => {
  const tw = useTailwind()
  return person ? (
    <AppTouchable
      toCommon={{ screen: "Profile", params: { userId: person.id } }}
    >
      <View
        style={[
          pfpLeft ? tw("flex-row-reverse") : tw("flex-row"),
          tw("items-center flex-shrink"),
        ]}
      >
        <AppText numberOfLines={1} style={tw("flex-shrink text-gray-600")}>
          {person.name}
        </AppText>
        <View style={tw("w-1")} />
        <ProfilePicture uri={person.imageUrl} style={tw("h-8")} />
      </View>
    </AppTouchable>
  ) : null
}
