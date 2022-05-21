import { MainButton, MainButtonProps } from "@components/MainButton"
import React, { VFC } from "react"
import { handleAuthErrors } from "src/auth"

export const AuthButton: VFC<
  MainButtonProps & { authFn: () => Promise<void> }
> = ({ authFn, ...props }) => {
  return <MainButton onPress={() => handleAuthErrors(authFn)} {...props} />
}
