import { AppKeyboardAvoidingView } from "@components/AppKeyboardAvoidingView"
import { AppKeyboardAvoidingViewScrollView } from "@components/AppKeyboardAvoidingViewScrollView"
import { AppTextInput } from "@components/AppTextInput"
import { MainButton } from "@components/MainButton"
import { SeparatedBy } from "@components/SeparatedBy"
import {
  CommonStackNavigationProp,
  CommonStackParams,
} from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation } from "urql"

export const leaveFeedback = gql(/* GraphQL */ `
  mutation leveFeedback($input: LeaveFeedbackInput!) {
    leaveFeedback(input: $input) {
      __typename
      id
    }
  }
`)

export const LeaveFeedbackScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "LeaveFeedback">
> = ({
  route: {
    params: { rentingId },
  },
}) => {
  const tw = useTailwind()
  const navigation = useNavigation<CommonStackNavigationProp>()

  const [text, onChangeText] = useState("")
  const [rating, onChangeRating] = useState("")

  const [_, leave] = useMutation(leaveFeedback)

  return (
    <AppKeyboardAvoidingView>
      <AppKeyboardAvoidingViewScrollView>
        <View style={tw("flex-1")}>
          <View style={tw("justify-between")}>
            <View style={tw("p-4")}>
              <SeparatedBy separator={<View style={tw("h-2")} />}>
                <AppTextInput
                  label="Text"
                  value={text}
                  returnKeyType="next"
                  multiline
                  onChangeText={onChangeText}
                />
                <AppTextInput
                  label="Rating"
                  keyboardType="decimal-pad"
                  value={`⭑ ${rating}`}
                  returnKeyType="next"
                  onChangeText={(input) =>
                    onChangeRating(`${Number.parseInt(input.slice(2)) || ""}`)
                  }
                />
                <MainButton
                  text="Leave Feedback"
                  onPress={async () => {
                    await leave({
                      input: {
                        text,
                        rating: Number(rating),
                        rentingId,
                      },
                    })
                    navigation.goBack()
                  }}
                />
              </SeparatedBy>
            </View>
          </View>
        </View>
      </AppKeyboardAvoidingViewScrollView>
    </AppKeyboardAvoidingView>
  )
}
