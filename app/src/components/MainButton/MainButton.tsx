import { AppText } from "@components/AppText"
import React, { VFC } from "react"
import { TouchableOpacity, TouchableOpacityProps } from "react-native"
import { useTailwind } from "tailwind-rn"

export type MainButtonProps = {
  text?: string
  secondary?: boolean
  onPress?: () => void
} & TouchableOpacityProps

export const MainButton: VFC<MainButtonProps> = ({
  text,
  secondary,
  onPress,
  style,
  ...props
}) => {
  const tw = useTailwind()
  return (
    <TouchableOpacity
      style={[
        tw("p-1 items-center rounded-lg"),
        secondary
          ? [tw("bg-primary-100"), onPress ? undefined : tw("bg-gray-100")]
          : [tw("bg-primary-500"), onPress ? undefined : tw("bg-gray-500")],
        style,
      ]}
      onPress={onPress}
      {...props}
    >
      <AppText
        style={[
          tw("text-lg font-semibold"),
          secondary
            ? [tw("text-primary-600"), onPress ? undefined : tw("bg-gray-600")]
            : [tw("text-white"), onPress ? undefined : tw("bg-gray-500")],
        ]}
      >
        {text}
      </AppText>
    </TouchableOpacity>
  )
}
