import Ionicons from "@expo/vector-icons/Ionicons"
import { AppImage } from "@components/AppImage"
import React, { VFC } from "react"
import { Text, View } from "react-native"
import { useTailwind } from "tailwind-rn"

export type FeedbackListItem = {
  id: string
  pfp: string
  name: string
  rating: number
  content: string
}

export const pfp =
  "https://images.unsplash.com/photo-1621983266286-09645be8fd01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&q=80"

export const FeedbackListItem: VFC<{ item: FeedbackListItem }> = ({
  item: { name, pfp, content },
}) => {
  const tw = useTailwind()
  return (
    <View style={tw("p-4 flex-row bg-white")}>
      <AppImage
        uri={pfp}
        aspectRatio={1}
        imageStyle={tw("h-14")}
        borderRadius={999}
      />
      <View style={tw("flex-1 pl-4")}>
        <Text style={tw("text-lg font-semibold")}>{name}</Text>
        <View style={tw("flex-row")}>
          <Ionicons name={"star"} color={"gold"} size={20} />
          <Ionicons name={"star"} color={"gold"} size={20} />
          <Ionicons name={"star"} color={"gold"} size={20} />
          <Ionicons name={"star"} color={"gold"} size={20} />
          <Ionicons name={"star"} color={"gold"} size={20} />
        </View>
        <View style={tw("h-1")} />
        <Text>{content}</Text>
      </View>
    </View>
  )
}
