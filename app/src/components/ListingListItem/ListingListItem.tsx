import { AppImage } from "@components/AppImage"
import { pfp } from "@components/PersonCard"
import { CommonStackNavigationProp } from "@components/WithCommonStackScreens"
import { useNavigation } from "@react-navigation/native"
import React, { VFC } from "react"
import { Text, View } from "react-native"
import { useTailwind } from "tailwind-rn"

export type ListingListItem = {
  id: string
  title: string
  imageUri: string
  cost: number
}

export const ListingListItem: VFC<{ item: ListingListItem }> = ({ item }) => {
  const tw = useTailwind()
  const { navigate } = useNavigation<CommonStackNavigationProp>()
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
            <Text style={tw("font-semibold")}>€{item.cost}/day</Text>
            <View style={tw("flex-row items-center")}>
              <Text style={tw("text-gray-600")}>Alice Alison</Text>
              <View style={tw("w-1")} />
              <AppImage
                uri={pfp}
                aspectRatio={1}
                imageStyle={tw("h-7")}
                borderRadius={999}
              />
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
    <Text
      style={[
        tw("text-lg font-medium"),
        { lineHeight: 22 },
        !text && { width: 0 },
      ]}
      numberOfLines={2}
    >
      {text ?? "\n"}
    </Text>
  )
  return (
    <View style={tw("flex-row")}>
      <Component />
      <Component text={text} />
    </View>
  )
}
