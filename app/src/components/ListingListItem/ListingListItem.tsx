import { AppImage } from "@components/AppImage"
import { AppText } from "@components/AppText"
import { names } from "@components/PersonCard"
import { ProfilePicture } from "@components/ProfilePicture"
import { CommonStackNavigationProp } from "@components/WithCommonStackScreens"
import { useNavigation } from "@react-navigation/native"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

export type ListingListItem = {
  id: string
  title: string
  imageUri: string
  cost: number
}

export const items: ListingListItem[] = [
  {
    id: "0",
    imageUri:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "Some camera or something or other",
    cost: 5,
  },
  {
    id: "1",
    imageUri:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "Electra Townie Beach Cruiser Bike",
    cost: 5,
  },
]

export const ListingListItem: VFC<{
  item: Omit<Partial<ListingListItem>, "id"> & { id: string }
}> = ({ item: { id } }) => {
  const tw = useTailwind()
  const { navigate } = useNavigation<CommonStackNavigationProp>()
  const item = { ...items[Number(id) % items.length], id: id }
  return (
    <AppImage
      vertical
      uri={item.imageUri}
      aspectRatio={16 / 9}
      imageStyle={tw("h-32")}
      onPress={() => {
        navigate("ListingDetail", { id: item.id, listItem: item })
      }}
      renderEnd={() => (
        <View style={tw("pt-1 w-full")}>
          <Title text={item.title} />
          <View style={tw("flex-row justify-between items-center")}>
            <AppText style={tw("font-semibold pr-2")}>{item.cost}€/day</AppText>
            <View style={tw("flex-row items-center flex-1")}>
              <AppText
                numberOfLines={1}
                style={tw("flex-shrink text-gray-600")}
              >
                {names[Number(item.id) % names.length]}
              </AppText>
              <View style={tw("w-1")} />
              <ProfilePicture id={item.id} style={tw("h-8")} />
            </View>
          </View>
        </View>
      )}
    />
  )
}

export const Title: VFC<{ text: string }> = ({ text }) => {
  const tw = useTailwind()
  const Component: VFC<{ text?: string }> = ({ text }) => (
    <AppText
      style={[
        tw("text-lg font-medium"),
        { lineHeight: 22 },
        !text && { width: 0 },
      ]}
      numberOfLines={2}
    >
      {text ?? "\n"}
    </AppText>
  )
  return (
    <View style={tw("flex-row")}>
      <Component />
      <Component text={text} />
    </View>
  )
}
