import { AppTouchable, AppTouchableProps } from "@components/AppTouchable"
import React, { VFC } from "react"
import { Image } from "react-native"
import { useTailwind } from "tailwind-rn"

export type AppImageProps = {
  uri?: string | null
  aspectRatio: number
  borderRadius?: number
} & AppTouchableProps

export const AppImage: VFC<AppImageProps> = ({
  uri,
  aspectRatio,
  borderRadius = 8,
  style,
  ...props
}) => {
  const tw = useTailwind()
  const isEnabled = props.onPress || props.to || props.toCommon
  return (
    <AppTouchable
      style={[
        { borderRadius, aspectRatio, borderWidth: 0.5 },
        tw("border-neutral-300 bg-neutral-200"),
        style,
      ]}
      disabled={!isEnabled}
      {...props}
    >
      <Image
        style={[{ borderRadius, resizeMode: "cover" }, tw("h-full")]}
        source={{ uri: uri ?? undefined }}
      />
    </AppTouchable>
  )
}
