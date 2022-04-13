import { AppText } from "@components/AppText"
import { ProfilePicture } from "@components/ProfilePicture"
import { Stars } from "@components/Stars"
import { DocumentType, gql } from "@gql/gql"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

const FeedbackListItemFragment = gql(/* GraphQL */ `
  fragment FeedbackListItemFragment on Feedback {
    __typename
    id
    createdAt
    rating
    text
    renter {
      __typename
      id
      name
      imageUrl
    }
  }
`)

export const FeedbackListItem: VFC<{
  feedback: DocumentType<typeof FeedbackListItemFragment>
}> = ({ feedback: { id, rating, text, renter } }) => {
  const tw = useTailwind()
  return (
    <View style={tw("p-4 flex-row bg-white")}>
      <ProfilePicture uri={renter?.imageUrl} style={tw("h-14")} />
      <View style={tw("flex-1 pl-4")}>
        <AppText style={tw("text-lg font-semibold")}>{renter?.name}</AppText>
        <Stars stars={rating} />
        <View style={tw("h-1")} />
        <AppText>{text}</AppText>
      </View>
    </View>
  )
}
