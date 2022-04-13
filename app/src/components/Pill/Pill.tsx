import { AppText } from "@components/AppText"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const Pill: VFC<{
  children?: React.ReactNode
  color?: "gray" | "green" | "blue" | "red"
}> = ({ children, color, ...props }) => {
  const tw = useTailwind()
  return (
    <View
      style={[
        tw("py-1 px-2 items-center rounded-full"),
        tw("bg-primary-100"),
        color === "gray" && tw("bg-gray-100"),
        color === "green" && tw("bg-green-100"),
        color === "blue" && tw("bg-blue-100"),
        color === "red" && tw("bg-red-100"),
      ]}
      {...props}
    >
      <AppText
        style={[
          tw("text-lg font-semibold"),
          tw("text-primary-600"),
          color === "gray" && tw("text-gray-600"),
          color === "green" && tw("text-green-600"),
          color === "blue" && tw("text-blue-600"),
          color === "red" && tw("text-red-600"),
        ]}
      >
        {children}
      </AppText>
    </View>
  )
}
