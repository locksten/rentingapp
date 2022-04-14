import React, { VFC } from "react"
import { Marker, MarkerProps } from "react-native-maps"

export const AppMapViewMarker: VFC<MarkerProps> | undefined = ({
  ...props
}) => <Marker {...props} />
