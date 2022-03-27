import { AppText } from "@components/AppText"
import { names } from "@components/PersonCard"
import { ProfilePicture } from "@components/ProfilePicture"
import Ionicons from "@expo/vector-icons/Ionicons"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

export type FeedbackListItem = {
  id: string
  rating: number
  content: string
}

export const FeedbackListItem: VFC<{ item: FeedbackListItem }> = ({
  item: { id, content },
}) => {
  const tw = useTailwind()
  return (
    <View style={tw("p-4 flex-row bg-white")}>
      <ProfilePicture id={id} style={tw("h-14")} />
      <View style={tw("flex-1 pl-4")}>
        <AppText style={tw("text-lg font-semibold")}>
          {names[Number(id) % names.length]}
        </AppText>
        <View style={tw("flex-row")}>
          <Ionicons name={"star"} color={"gold"} size={20} />
          <Ionicons name={"star"} color={"gold"} size={20} />
          <Ionicons name={"star"} color={"gold"} size={20} />
          <Ionicons name={"star"} color={"gold"} size={20} />
          <Ionicons name={"star"} color={"gold"} size={20} />
        </View>
        <View style={tw("h-1")} />
        <AppText>{content}</AppText>
      </View>
    </View>
  )
}
