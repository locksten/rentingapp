import { AppText } from "@components/AppText"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const ChatPage: VFC = ({ ...props }) => {
  const tw = useTailwind()
  return (
    <View style={tw("p-2 border-4 bg-purple-200 border-purple-800")} {...props}>
      <AppText style={tw("font-bold")}>ChatPage</AppText>
    </View>
  )
}
