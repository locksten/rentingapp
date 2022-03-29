import { AppText } from "@components/AppText/AppText"
import React, { VFC } from "react"
import { TextInput, TextInputProps, View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const AppTextInput: VFC<TextInputProps & { label: string }> = ({
  label,
  ...props
}) => {
  const tw = useTailwind()
  return (
    <View style={tw("w-full")}>
      <AppText>{label}</AppText>
      <TextInput
        style={tw("text-lg px-2 py-2 bg-gray-200 rounded-lg")}
        {...props}
      />
    </View>
  )
}
