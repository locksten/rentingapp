import { useHeaderHeight } from "@react-navigation/elements"
import React, { FC } from "react"
import { KeyboardAvoidingView, Platform } from "react-native"
import { useTailwind } from "tailwind-rn"

export const AppKeyboardAvoidingView: FC = ({ children }) => {
  const tw = useTailwind()
  const headerHeight = useHeaderHeight()
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={headerHeight}
      style={tw("flex-1")}
    >
      {children}
    </KeyboardAvoidingView>
  )
}
