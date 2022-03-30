import React, { useState, VFC } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { useTailwind } from "tailwind-rn"

export type AppImageProps = {
  uri?: string | null
  aspectRatio: number
  renderStart?: () => JSX.Element
  renderEnd?: () => JSX.Element
  onPress?: () => void
  borderRadius?: number
  style?: StyleProp<ViewStyle>
  imageStyle?: StyleProp<ImageStyle>
} & (
  | { vertical?: false; horizontal?: false }
  | { vertical: true; horizontal?: false }
  | { vertical?: false; horizontal: true }
)

export const AppImage: VFC<AppImageProps> = ({
  uri,
  aspectRatio,
  renderStart,
  renderEnd,
  onPress,
  borderRadius = 8,
  style,
  imageStyle,
  ...props
}) => {
  const tw = useTailwind()
  const horizontal = !!props.horizontal
  const mainAxisSizeName = horizontal ? "width" : "height"
  const crossAxisSizeName = horizontal ? "height" : "width"

  const [main, setMain] = useState<number | undefined>(undefined)
  const cross = main
    ? main * (horizontal ? 1 / aspectRatio : aspectRatio)
    : undefined

  const Slot: VFC<{ element?: () => JSX.Element }> = ({ element }) =>
    element ? (
      <View style={{ [crossAxisSizeName]: cross }}>{element()}</View>
    ) : null

  return (
    <View style={[tw(`${horizontal ? "flex-row" : "flex-col"}`), style]}>
      <Slot element={renderStart} />
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        activeOpacity={0.7}
        onLayout={
          main
            ? undefined
            : ({ nativeEvent: { layout } }) => setMain(layout[mainAxisSizeName])
        }
        style={[
          {
            borderRadius,
            borderWidth: 0.5,
            borderColor: "#00000010",
          },
          tw("justify-center items-center"),
          imageStyle,
        ]}
      >
        <Image
          source={{ uri: uri ?? undefined }}
          resizeMode="cover"
          style={[
            {
              aspectRatio: aspectRatio,
              [mainAxisSizeName]: "100%",
              borderRadius: borderRadius,
            },
            tw("bg-gray-200 items-center"),
            imageStyle,
          ]}
        />
      </TouchableOpacity>
      <Slot element={renderEnd} />
    </View>
  )
}
