import { AppTextInput } from "@components/AppTextInput"
import { MainButton } from "@components/MainButton"
import { MediumListWidth } from "@components/MediumListWidth"
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

export const makeReport = gql(/* GraphQL */ `
  mutation makeReport($input: MakeReportInput!) {
    makeReport(input: $input) {
      __typename
      id
    }
  }
`)

export const MakeReportScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "MakeReport">
> = ({
  route: {
    params: { feedbackId, listingId },
  },
}) => {
  const tw = useTailwind()
  const navigation = useNavigation<CommonStackNavigationProp>()
  const [reason, onChangeReason] = useState("")

  const [_, report] = useMutation(makeReport)

  const onReport = async () => {
    await report({
      input: {
        reason,
        feedbackId,
        listingId,
      },
    })
    navigation.goBack()
  }

  return (
    <MediumListWidth style={tw("justify-between px-4 py-4")}>
      <SeparatedBy separator={<View style={tw("h-2")} />}>
        <AppTextInput
          label="Reason"
          value={reason}
          onChangeText={onChangeReason}
          onSubmitEditing={onReport}
        />
        <MainButton text="Submit Report" onPress={onReport} />
      </SeparatedBy>
    </MediumListWidth>
  )
}
