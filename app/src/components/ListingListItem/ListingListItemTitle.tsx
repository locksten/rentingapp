import { AppText } from "@components/AppText"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const ListingListItemTitle: VFC<{
  text?: string | null
  reserveHeight?: boolean
}> = ({ text, reserveHeight }) => {
  const tw = useTailwind()
  const Component: VFC<{ text?: string }> = ({ text }) => (
    <AppText
      style={[
        tw("text-lg font-medium"),
        { lineHeight: 22 },
        !text && { width: 0 },
      ]}
      numberOfLines={2}
    >
      {text ?? "\n"}
    </AppText>
  )
  return (
    <View style={tw("flex-row")}>
      {!!reserveHeight && <Component />}
      <Component text={text || "_____"} />
    </View>
  )
}
