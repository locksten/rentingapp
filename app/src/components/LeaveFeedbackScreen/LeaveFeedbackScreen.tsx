import { AppKeyboardAvoidingView } from "@components/AppKeyboardAvoidingView"
import { AppKeyboardAvoidingViewScrollView } from "@components/AppKeyboardAvoidingViewScrollView"
import { AppTextInput } from "@components/AppTextInput"
import { AppTouchable } from "@components/AppTouchable"
import { MainButton } from "@components/MainButton"
import { SeparatedBy } from "@components/SeparatedBy"
import {
  CommonStackNavigationProp,
  CommonStackParams,
} from "@components/WithCommonStackScreens"
import Ionicons from "@expo/vector-icons/Ionicons"
import { gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { SafeAreaView, View } from "react-native"
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
    params: { rentingId, withReason },
  },
}) => {
  const tw = useTailwind()
  const navigation = useNavigation<CommonStackNavigationProp>()

  const [text, onChangeText] = useState("")
  const [rating, setrating] = useState(5)

  const [_, leave] = useMutation(leaveFeedback)

  return (
    <SafeAreaView style={tw("flex-1")}>
      <AppKeyboardAvoidingView>
        <AppKeyboardAvoidingViewScrollView>
          <View style={tw("p-4 flex-1 justify-between")}>
            <SeparatedBy separator={<View style={tw("h-2")} />}>
              {withReason && (
                <AppTextInput
                  label="Feedback"
                  value={text}
                  returnKeyType="next"
                  multiline
                  onChangeText={onChangeText}
                />
              )}
              <View style={tw("flex-row justify-center py-4")}>
                {[...Array(5)].map((_, idx) => (
                  <AppTouchable
                    key={idx}
                    onPress={() => {
                      setrating(idx + 1)
                    }}
                  >
                    <Ionicons
                      style={tw("px-2")}
                      name={"ios-star"}
                      color={idx < rating ? "gold" : "#dddddd"}
                      size={32}
                    />
                  </AppTouchable>
                ))}
              </View>
            </SeparatedBy>
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
          </View>
        </AppKeyboardAvoidingViewScrollView>
      </AppKeyboardAvoidingView>
    </SafeAreaView>
  )
}
