import { AccountScreenParams } from "@components/AccountScreen/AccountScreen"
import { AppTextInput } from "@components/AppTextInput"
import { MainButtonProps, MainButton } from "@components/MainButton"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { View } from "react-native"
import { emailSignIn, emailSignUp } from "src/auth"
import { useTailwind } from "tailwind-rn"

export const SignIn: VFC<
  NativeStackScreenProps<AccountScreenParams, "SignIn">
> = () => {
  const tw = useTailwind()
  const [name, onChangeName] = useState("")
  const [email, onChangeEmail] = useState("")
  const [password, onChangePassword] = useState("")

  const AuthButton: VFC<MainButtonProps & { authFn: () => Promise<void> }> = ({
    authFn,
    ...props
  }) => {
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

  return (
    <View style={tw("flex-1 px-4 justify-center")}>
      <AppTextInput
        onChangeText={onChangeName}
        label="Name"
        autoCorrect={false}
        textContentType="name"
        autoCapitalize="words"
        autoCompleteType="name"
        returnKeyType="next"
      />
      <View style={tw("h-2")} />
      <AppTextInput
        onChangeText={onChangeEmail}
        label="Email"
        autoCorrect={false}
        textContentType="username"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCompleteType="username"
        returnKeyType="next"
      />
      <View style={tw("h-2")} />
      <AppTextInput
        onChangeText={onChangePassword}
        label="Password"
        secureTextEntry
        textContentType="password"
        autoCompleteType="password"
        returnKeyType="done"
        onSubmitEditing={async () => {
          console.log("sign up", await emailSignIn(email, password))
        }}
      />
      <View style={tw("h-2")} />
      <View>
        <View style={tw("flex-row")}>
          <AuthButton
            style={tw("flex-1")}
            text="Sign up"
            secondary
            authFn={async () => {
              console.log("sign up", await emailSignUp(email, password, name))
            }}
          />
          <View style={tw("w-2")} />
          <AuthButton
            style={tw("flex-1")}
            text="Sign in"
            authFn={async () => {
              console.log("sign up", await emailSignIn(email, password))
            }}
          />
        </View>
      </View>
    </View>
  )
}
