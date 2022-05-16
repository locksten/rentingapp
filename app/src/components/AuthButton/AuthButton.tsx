import { MainButtonProps, MainButton } from "@components/MainButton"
import React, { VFC } from "react"

export const AuthButton: VFC<
  MainButtonProps & { authFn: () => Promise<void> }
> = ({ authFn, ...props }) => {
  return (
    <MainButton
      onPress={async () => {
        try {
          await authFn()
        } catch (e) {
          console.log("Auth error:", e)
        }
      }}
      {...props}
    />
  )
}
