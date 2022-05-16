import React, { FC } from "react"
import { View, ViewProps } from "react-native"
import { useTailwind } from "tailwind-rn"

export const MediumListWidth: FC<ViewProps> = ({ children, ...props }) => {
  const tw = useTailwind()
  return (
    <View style={tw("flex-1 items-center")}>
      <View {...props} style={[tw("flex-1 w-full max-w-lg"), props.style]}>
        {children}
      </View>
    </View>
  )
}
