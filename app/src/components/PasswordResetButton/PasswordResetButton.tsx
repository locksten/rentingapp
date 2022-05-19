import { AppText } from "@components/AppText"
import { MainButton, MainButtonProps } from "@components/MainButton"
import React, { VFC, useState } from "react"
import { View } from "react-native"
import { resetPassword } from "src/auth"
import { useTailwind } from "tailwind-rn/dist"

export const PasswordResetButton: VFC<MainButtonProps & { email: string }> = ({
  email,
  ...props
}) => {
  const tw = useTailwind()
  const [done, setDone] = useState(false)
  return (
    <View>
      <MainButton
        secondary
        style={tw("w-full")}
        text={"Forgot Password"}
        onPress={async () => {
          try {
            await resetPassword(email)
          } catch (e) {
            console.log(e)
          }
          setDone(true)
        }}
        {...props}
      />
      <View style={tw("pt-4 h-12")}>
        {done && (
          <AppText style={tw("font-semibold text-center text-gray-600")}>
            Password Reset Email Sent
          </AppText>
        )}
      </View>
    </View>
  )
}
