import { AccountScreenParams } from "@components/AccountScreen/AccountScreen"
import { AppTextInput } from "@components/AppTextInput"
import { AuthButton } from "@components/AuthButton"
import { MediumListWidth } from "@components/MediumListWidth"
import { ProfilePicture } from "@components/ProfilePicture"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { View } from "react-native"
import { emailSignUp, registrationDetails } from "src/auth"
import { imageUploadStateMessage, useUploadImage } from "src/imageUpload"
import { useTailwind } from "tailwind-rn"

export const SignUp: VFC<
  NativeStackScreenProps<AccountScreenParams, "SignUp">
> = () => {
  const tw = useTailwind()
  const [name, onChangeName] = useState("")
  const { imageUpload, pickImage } = useUploadImage("user")

  const signUp = async () => {
    if (imageUpload.status !== "uploaded") return
    await emailSignUp(
      registrationDetails.email,
      registrationDetails.password,
      name,
      imageUpload.uri,
    )
  }

  return (
    <MediumListWidth style={tw("justify-center px-4")}>
      <View style={tw("items-center")}>
        <ProfilePicture
          uri={imageUpload.status === "uploaded" ? imageUpload.uri : undefined}
          onPress={pickImage}
          textStyle={tw("text-sm")}
          text={
            imageUpload.status === "uploaded"
              ? undefined
              : imageUploadStateMessage[imageUpload.status]
          }
          style={tw("w-24")}
        />
      </View>
      <AppTextInput
        onChangeText={onChangeName}
        label="Name"
        autoCorrect={false}
        textContentType="name"
        autoCapitalize="words"
        autoCompleteType="name"
        returnKeyType="next"
        onSubmitEditing={signUp}
      />
      <View style={tw("h-2")} />
      <View>
        <View style={tw("flex-row")}>
          <AuthButton style={tw("flex-1")} text="Sign up" authFn={signUp} />
        </View>
      </View>
    </MediumListWidth>
  )
}
