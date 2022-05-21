import { MainButtonProps, MainButton } from "@components/MainButton"
import React, { VFC } from "react"
import { errorToast } from "src/toast"

export const AuthButton: VFC<
  MainButtonProps & { authFn: () => Promise<void> }
> = ({ authFn, ...props }) => {
  return (
    <MainButton
      onPress={async () => {
        try {
          await authFn()
        } catch (e: any) {
          console.log(JSON.stringify(e))
          const errMsg = (e.message as string).match(/\(([^)]+)\)/)?.[1]
          errorToast(
            {
              "auth/popup-closed-by-user": "Sign-in popup closed",
              "auth/wrong-password": "Incorrect password",
              "auth/weak-password": "Password too weak",
              "auth/invalid-email": "Invalid email",
              "auth/email-already-in-use": "Email already in-use",
            }[(errMsg as string) ?? ""],
          )
        }
      }}
      {...props}
    />
  )
}
