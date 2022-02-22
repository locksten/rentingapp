import React, { VFC } from "react"
import { Text, TouchableOpacity } from "react-native"
import { useTailwind } from "tailwind-rn"

export const MainButton: VFC<{
  text?: string
  secondary?: boolean
  onPress?: () => void
}> = ({ text, secondary, onPress }) => {
  const tw = useTailwind()
  return (
    <TouchableOpacity
      disabled={!onPress}
      style={[
        tw("p-1 items-center rounded-lg"),
        secondary
          ? [tw("bg-primary-100"), onPress ? undefined : tw("bg-gray-100")]
          : [tw("bg-primary-500"), onPress ? undefined : tw("bg-gray-500")],
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          tw("text-lg font-semibold"),
          secondary
            ? [tw("text-primary-600"), onPress ? undefined : tw("bg-gray-600")]
            : [tw("text-white"), onPress ? undefined : tw("bg-gray-500")],
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}
