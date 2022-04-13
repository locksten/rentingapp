import Ionicons from "@expo/vector-icons/Ionicons"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const Stars: VFC<{ stars?: number | null }> = ({ stars }) => {
  const tw = useTailwind()
  return (
    <View style={tw("flex-row")}>
      {[...Array(5)].map((_, i) => (
        <Ionicons
          key={i}
          name={"star"}
          color={(stars ?? 0) - 1 >= i ? "gold" : "#dddddd"}
          size={20}
        />
      ))}
    </View>
  )
}
