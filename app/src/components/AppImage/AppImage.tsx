import { AppText } from "@components/AppText"
import { AppTouchable, AppTouchableProps } from "@components/AppTouchable"
import React, { VFC } from "react"
import { Image, StyleProp, TextStyle, View } from "react-native"
import { useTailwind } from "tailwind-rn"

export type AppImageProps = {
  uri?: string | null
  aspectRatio: number
  borderRadius?: number
  textStyle?: StyleProp<TextStyle> | undefined
  text?: string
} & AppTouchableProps

export const AppImage: VFC<AppImageProps> = ({
  uri,
  aspectRatio,
  borderRadius = 8,
  text,
  textStyle,
  style,
  ...props
}) => {
  const tw = useTailwind()
  const isEnabled = props.onPress || props.to || props.toCommon

  const ImageText: VFC<{ text: string }> = ({ text }) => (
    <View style={tw("absolute h-full w-full justify-center")}>
      <AppText
        style={[
          tw("p-2 text-center font-bold text-xl text-gray-500"),
          textStyle,
        ]}
      >
        {text}
      </AppText>
    </View>
  )

  return (
    <AppTouchable
      style={[
        { borderRadius, aspectRatio, borderWidth: 0.5 },
        tw("border-neutral-300 bg-neutral-200 relative"),
        style,
      ]}
      disabled={!isEnabled}
      {...props}
    >
      <Image
        style={[{ borderRadius, resizeMode: "cover" }, tw("h-full")]}
        source={{ uri: uri ?? undefined }}
      />
      {!!text && <ImageText text={text} />}
    </AppTouchable>
  )
}
