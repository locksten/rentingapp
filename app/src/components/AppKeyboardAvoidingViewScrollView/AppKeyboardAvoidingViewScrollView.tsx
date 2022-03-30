import React, { FC } from "react"
import { Platform, ScrollView } from "react-native"
import { useTailwind } from "tailwind-rn"

export const AppKeyboardAvoidingViewScrollView: FC = ({ children }) => {
  const tw = useTailwind()
  return (
    <ScrollView
      contentContainerStyle={tw("flex-grow justify-end")}
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      ref={(ref) => {
        ref?.scrollToEnd({ animated: false })
      }}
    >
      {children}
    </ScrollView>
  )
}
