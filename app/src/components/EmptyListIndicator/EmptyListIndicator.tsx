import { AppText } from "@components/AppText"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const EmptyListIndicator: VFC = () => {
  const tw = useTailwind()
  return (
    <View style={tw("flex-1 justify-center pt-4 pb-8")}>
      <AppText style={tw("text-center text-xl font-bold text-gray-400")}>
        Nothing Here
      </AppText>
    </View>
  )
}
