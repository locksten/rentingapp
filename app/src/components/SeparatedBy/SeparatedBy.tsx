import React, { Children, ReactNode, VFC } from "react"
import { View, ViewProps } from "react-native"

export const SeparatedBy: VFC<
  ViewProps & {
    separator: ReactNode
    start?: boolean
    end?: boolean
  }
> = ({ separator, children, start, end, ...props }) => (
  <View {...props}>
    {start && separator}
    {Children.map(children, (child, idx) => (
      <View key={idx}>
        {child}
        {child && idx !== Children.count(children) - 1 && separator}
      </View>
    ))}
    {end && separator}
  </View>
)
