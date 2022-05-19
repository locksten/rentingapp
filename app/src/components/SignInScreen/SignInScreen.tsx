import { AccountScreenParams } from "@components/AccountScreen/AccountScreen"
import { AppTextInput } from "@components/AppTextInput"
import { AuthButton } from "@components/AuthButton"
import { MainButton } from "@components/MainButton"
import { MediumListWidth } from "@components/MediumListWidth"
import { PasswordResetButton } from "@components/PasswordResetButton"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { View } from "react-native"
import { emailSignIn, registrationDetails } from "src/auth"
import { useTailwind } from "tailwind-rn"

export const SignIn: VFC<
  NativeStackScreenProps<AccountScreenParams, "SignIn">
> = () => {
  const tw = useTailwind()
  const [email, onChangeEmail] = useState("")
  const [password, onChangePassword] = useState("")

  const signIn = async () => {
    await emailSignIn(email, password)
  }

  return (
    <MediumListWidth style={tw("justify-center px-4")}>
      <View style={tw("h-2")} />
      <AppTextInput
        onChangeText={(text) => {
          onChangeEmail(text)
          registrationDetails.email = text
        }}
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
        onChangeText={(text) => {
          onChangePassword(text)
          registrationDetails.password = text
        }}
        label="Password"
        secureTextEntry
        textContentType="password"
        autoCompleteType="password"
        returnKeyType="done"
        onSubmitEditing={signIn}
      />
      <View style={tw("h-2")} />
      <View>
        <View style={tw("flex-row")}>
          <MainButton
            style={tw("flex-1")}
            text="Sign up"
            secondary
            to={{
              screen: "Account",
              params: { screen: "SignUp" },
            }}
          />
          <View style={tw("w-2")} />
          <AuthButton style={tw("flex-1")} text="Sign in" authFn={signIn} />
        </View>
        <View style={tw("h-2")} />
        <PasswordResetButton email={email} />
      </View>
    </MediumListWidth>
  )
}
