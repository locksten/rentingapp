import React, { VFC } from "react"
import { Image, TouchableOpacity, TouchableOpacityProps } from "react-native"
import { useTailwind } from "tailwind-rn"

export type AppImageProps = {
  uri?: string | null
  aspectRatio: number
  borderRadius?: number
} & TouchableOpacityProps

export const AppImage: VFC<AppImageProps> = ({
  uri,
  aspectRatio,
  borderRadius = 8,
  style,
  ...props
}) => {
  const tw = useTailwind()
  return (
    <TouchableOpacity
      style={[
        { borderRadius, aspectRatio },
        tw("border border-neutral-300 bg-neutral-200"),
        style,
      ]}
      disabled={!props.onPress}
      {...props}
    >
      <Image
        style={[{ borderRadius, resizeMode: "cover" }, tw("h-full")]}
        source={{ uri: uri ?? undefined }}
      />
    </TouchableOpacity>
  )
}
