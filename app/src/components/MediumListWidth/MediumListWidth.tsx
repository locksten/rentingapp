import React, { FC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const MediumListWidth: FC = ({ children }) => {
  const tw = useTailwind()
  return (
    <View style={tw("flex-1 items-center")}>
      <View style={tw("flex-1 w-full max-w-lg")}>{children}</View>
    </View>
  )
}
