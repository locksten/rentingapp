import { AppText } from "@components/AppText"
import { MainButton } from "@components/MainButton"
import { ProfilePicture } from "@components/ProfilePicture"
import { RootTabsNavigationProp } from "@components/RootTabNavigator"
import Ionicons from "@expo/vector-icons/Ionicons"
import { DocumentType, gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

const PersonCardFragment = gql(/* GraphQL */ `
  fragment PersonCardFragment on User {
    __typename
    id
    isMe
    name
    listingCount
  }
`)

export const PersonCard: VFC<{
  person: DocumentType<typeof PersonCardFragment>
}> = ({ person }) => {
  const tw = useTailwind()
  const { navigate } = useNavigation<RootTabsNavigationProp>()
  const { id, isMe, listingCount, name } = person

  const NameAndPic = (
    <View style={tw(" items-center justify-center")}>
      <ProfilePicture id={id} style={tw("h-16")} />
      <AppText
        numberOfLines={2}
        style={tw("pt-1 text-2xl font-semibold flex-1")}
      >
        {name}
      </AppText>
    </View>
  )

  return (
    <View
      style={tw(
        "p-2 pt-4 flex-row justify-between items-center bg-white rounded-2xl",
      )}
    >
      <View style={tw("w-full")}>
        {NameAndPic}
        <View style={tw("h-4")} />
        <View style={tw("flex-row justify-around pb-4")}>
          <Ratings rating={4.3} ratingCount={12} />
          <Rentings asOwner={23} asRenter={8} />
          <Listings listingCount={listingCount} />
        </View>
        {isMe || (
          <MainButton
            secondary
            text={"Message"}
            onPress={() => {
              navigate("Messages", { screen: "Chat", initial: false })
            }}
          />
        )}
      </View>
    </View>
  )
}

export const names = ["Alice Alison", "Charlie Charmander"]

const Fact: VFC<{
  icon: keyof typeof Ionicons["glyphMap"]
  name: string
  value: string
}> = ({ icon, name, value }) => {
  const tw = useTailwind()
  return (
    <View style={tw("items-center")}>
      <AppText style={tw("pb-1")}>{name}</AppText>
      <Ionicons name={icon} color={"black"} size={24} style={{ height: 24 }} />
      <AppText style={tw("pt-1 font-bold")}>{value}</AppText>
    </View>
  )
}

const Ratings: VFC<{ rating: number; ratingCount: number }> = ({
  rating,
  ratingCount,
}) => {
  return (
    <Fact
      name="Ratings"
      icon={"star-outline"}
      value={`${rating.toFixed(1)} (${ratingCount})`}
    />
  )
}

const Rentings: VFC<{ asOwner: number; asRenter: number }> = ({
  asOwner,
  asRenter,
}) => {
  return (
    <Fact name="Rentings" icon={"repeat"} value={`${asOwner}↑ ${asRenter}↓`} />
  )
}

const Listings: VFC<{ listingCount?: number | null }> = ({
  listingCount = 0,
}) => {
  return <Fact name="Listings" icon={"list"} value={`${listingCount}`} />
}
