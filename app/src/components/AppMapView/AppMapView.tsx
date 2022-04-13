import React, { VFC } from "react"
import { View } from "react-native"
import MapView, { MapViewProps } from "react-native-maps"
import { useTailwind } from "tailwind-rn"

export const AppMapView: VFC<MapViewProps> | undefined = ({ ...props }) => {
  const tw = useTailwind()
  return (
    <View style={tw("flex-1 rounded-2xl overflow-hidden")}>
      <MapView style={tw("flex-1")} {...props} />
    </View>
  )
}
