import { AppText } from "@components/AppText"
import { AuthButton } from "@components/AuthButton"
import { MainButtonProps } from "@components/MainButton"
import React, { useState, VFC } from "react"
import { View } from "react-native"
import { resetPassword } from "src/auth"
import { toastError } from "src/toast"
import { useTailwind } from "tailwind-rn/dist"

export const PasswordResetButton: VFC<MainButtonProps & { email: string }> = ({
  email,
  ...props
}) => {
  const tw = useTailwind()
  const [isSent, setIsSent] = useState(false)
  return (
    <View>
      <AuthButton
        secondary
        style={tw("w-full")}
        text={"Forgot Password"}
        authFn={async () => {
          if (!email) {
            toastError("Email is required")
            return
          }
          setIsSent(false)
          await resetPassword(email)
          setIsSent(true)
        }}
        {...props}
      />
      <View style={tw("pt-4 h-12")}>
        {isSent && (
          <AppText style={tw("font-semibold text-center text-gray-600")}>
            Password Reset Email Sent
          </AppText>
        )}
      </View>
    </View>
  )
}
