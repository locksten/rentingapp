import React, { FC } from "react"
import { Text, TextProps } from "react-native"
import { useTailwind } from "tailwind-rn/dist"

export const AppText: FC<TextProps> = ({ children, style, ...props }) => {
  const tw = useTailwind()
  return (
    <Text {...props} style={[tw("text-base"), style]}>
      {children}
    </Text>
  )
}
