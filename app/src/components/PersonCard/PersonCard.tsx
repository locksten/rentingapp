import Ionicons from "@expo/vector-icons/Ionicons"
import { AppImage } from "@components/AppImage"
import React, { VFC } from "react"
import { Text, View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const pfp =
  "https://images.unsplash.com/photo-1621983266286-09645be8fd01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&q=80"

export const PersonCard: VFC<{ renderBottom?: () => JSX.Element }> = ({
  renderBottom,
}) => {
  const tw = useTailwind()
  return (
    <View
      style={tw(
        "p-2 pt-4 flex-row justify-between items-center bg-white rounded-2xl",
      )}
    >
      <View style={tw("w-full")}>
        <NameAndPic name="Alice Alison" pfp={pfp} />
        <View style={tw("h-4")} />
        <View style={tw("flex-row justify-around")}>
          <Ratings rating={4.3} ratingCount={12} />
          <Rentings asOwner={23} asRenter={8} />
          <Listings listingCount={12} />
        </View>
        {renderBottom && <View style={tw("pt-4")}>{renderBottom?.()}</View>}
      </View>
    </View>
  )
}

const NameAndPic: VFC<{
  name: string
  pfp: string
}> = ({ name, pfp }) => {
  const tw = useTailwind()
  return (
    <View style={tw("flex-row items-center justify-center")}>
      <AppImage
        uri={pfp}
        aspectRatio={1}
        imageStyle={tw("h-14")}
        borderRadius={999}
      />
      <Text style={tw("pl-4 text-2xl font-semibold")}>{name}</Text>
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
      <Text style={tw("pb-1")}>{name}</Text>
      <Ionicons name={icon} color={"black"} size={24} style={{ height: 24 }} />
      <Text style={tw("pt-1 font-bold")}>{value}</Text>
    </View>
  )
}

const Ratings: VFC<{ rating: number; ratingCount: number }> = ({
  rating,
  ratingCount,
}) => {
  return (
    <Fact
      name="Rating"
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

const Listings: VFC<{ listingCount: number }> = ({ listingCount }) => {
  return <Fact name="Listings" icon={"list"} value={`${listingCount}`} />
}
