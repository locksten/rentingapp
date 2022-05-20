import { AppText } from "@components/AppText"
import { AppTouchable } from "@components/AppTouchable"
import { MainButton } from "@components/MainButton"
import { ProfilePicture } from "@components/ProfilePicture"
import Ionicons from "@expo/vector-icons/Ionicons"
import { DocumentType, gql } from "@gql/gql"
import React, { VFC } from "react"
import { View } from "react-native"
import { useUserDetails } from "src/auth"
import { useTailwind } from "tailwind-rn"
import { useMutation } from "urql"

const PersonCardFragment = gql(/* GraphQL */ `
  fragment PersonCardFragment on User {
    __typename
    id
    isAdmin
    isBanned
    isMe
    name
    imageUrl
    listingCount
    rentingOwnerCount
    rentingRenterCount
    ratingCount
    rating
    isStripeAccountOnboarded
  }
`)

export const BanUser = gql(/* GraphQL */ `
  mutation banUser($input: BanUserInput!) {
    banUser(input: $input) {
      __typename
      id
      name
      isBanned
      isAdmin
    }
  }
`)

export const PersonCard: VFC<{
  person: DocumentType<typeof PersonCardFragment>
  disableTouchable?: boolean
}> = ({ person, disableTouchable }) => {
  const tw = useTailwind()
  const {
    isMe,
    isAdmin,
    name,
    imageUrl,
    listingCount,
    rentingOwnerCount,
    rentingRenterCount,
    ratingCount,
    rating,
    id,
    isStripeAccountOnboarded,
  } = person

  const NameAndPic = (
    <View style={tw("items-center justify-center")}>
      <ProfilePicture uri={imageUrl} style={tw("h-16")} />
      <AppText
        numberOfLines={2}
        style={tw("pt-1 text-center text-2xl font-semibold")}
      >
        {isStripeAccountOnboarded && (
          <Ionicons
            name={"ios-checkmark-circle-outline"}
            color={"black"}
            size={21}
          />
        )}
        {`${isStripeAccountOnboarded ? " " : ""}${name}`}
      </AppText>
    </View>
  )

  return (
    <AppTouchable
      toCommon={
        disableTouchable
          ? undefined
          : { screen: "Profile", params: { userId: id } }
      }
      style={tw(
        "p-2 pt-4 flex-row justify-between items-center bg-white rounded-2xl",
      )}
    >
      <View style={tw("w-full")}>
        {!!isAdmin && (
          <View style={tw("px-2 pb-4")}>
            <View style={tw("py-1 px-2 rounded-lg w-full bg-orange-100")}>
              <AppText
                style={tw("text-orange-600 text-lg font-semibold text-center")}
              >
                Administrator
              </AppText>
            </View>
          </View>
        )}
        {NameAndPic}
        <View style={tw("h-4")} />
        <View style={tw("flex-row justify-around pb-4")}>
          <Ratings rating={rating} ratingCount={ratingCount} />
          <Rentings asOwner={rentingOwnerCount} asRenter={rentingRenterCount} />
          <Listings listingCount={listingCount} />
        </View>
        {!!isMe || (
          <MainButton
            secondary
            text={"Message"}
            to={{
              screen: "Messages",
              params: {
                screen: "Chat",
                params: { recipientId: person.id },
                initial: false,
              },
            }}
          />
        )}
        <BanButton person={person} />
      </View>
    </AppTouchable>
  )
}

const BanButton: VFC<{
  person: DocumentType<typeof PersonCardFragment>
}> = ({ person }) => {
  const userDetails = useUserDetails()
  const [_, banUser] = useMutation(BanUser)
  const tw = useTailwind()
  return (
    <View>
      {userDetails?.isAdmin && !person.isMe && (
        <View style={tw("pt-2")}>
          <MainButton
            secondary
            text={person.isBanned ? "User Banned" : "Ban User"}
            onPress={
              person.isBanned
                ? undefined
                : () => {
                    banUser({ input: { userId: person.id } })
                  }
            }
          />
        </View>
      )}
    </View>
  )
}

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

const Ratings: VFC<{ rating?: number | null; ratingCount?: number | null }> = ({
  rating,
  ratingCount,
}) => {
  return (
    <Fact
      name="Ratings"
      icon={"star-outline"}
      value={`${(rating ?? 0).toFixed(1)} (${ratingCount ?? 0})`}
    />
  )
}

const Rentings: VFC<{ asOwner?: number | null; asRenter?: number | null }> = ({
  asOwner,
  asRenter,
}) => {
  return (
    <Fact
      name="Rentings"
      icon={"repeat"}
      value={`${asOwner ?? 0}↑ ${asRenter ?? 0}↓`}
    />
  )
}

const Listings: VFC<{ listingCount?: number | null }> = ({ listingCount }) => {
  return <Fact name="Listings" icon={"list"} value={`${listingCount ?? 0}`} />
}
