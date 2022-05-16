import { AppText } from "@components/AppText/AppText"
import React, { VFC } from "react"
import { TextInput, TextInputProps, View, ViewStyle } from "react-native"
import { useTailwind } from "tailwind-rn"

export type AppTextInputProps = TextInputProps & {
  label?: string
  containerStyle?: ViewStyle
}

export const AppTextInput: VFC<AppTextInputProps> = ({
  containerStyle,
  label,
  ...props
}) => {
  const tw = useTailwind()
  return (
    <View style={[tw("w-full"), containerStyle]}>
      {!!label && <AppText>{label}</AppText>}
      <View style={tw("bg-gray-200 rounded-lg px-2 py-2")}>
        <TextInput style={tw("text-lg")} {...props} />
      </View>
    </View>
  )
}
