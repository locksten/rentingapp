import { AppText } from "@components/AppText"
import { FeedbackListItem } from "@components/FeedbackListItem"
import { MainButton } from "@components/MainButton"
import { MediumListWidth } from "@components/MediumListWidth"
import { Reports } from "@components/Reports"
import { SeparatedBy } from "@components/SeparatedBy"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

export const Feedback = gql(/* GraphQL */ `
  query Feedback($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on Feedback {
        id
        text
        reports {
          id
          __typename
          ...ReportFragment
        }
        ...FeedbackListItemFragment
      }
    }
  }
`)

export const FeedbackScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "Feedback">
> = ({
  route: {
    params: { feedbackId },
  },
}) => {
  const tw = useTailwind()

  const [{ data, error }] = useQuery({
    query: Feedback,
    variables: { nodeId: feedbackId },
    requestPolicy: "cache-and-network",
  })
  const item = data?.node?.__typename === "Feedback" ? data.node : undefined

  if (error || !item?.__typename)
    return <AppText>Error {error?.message}</AppText>

  return (
    <MediumListWidth style={tw("justify-between")}>
      <SeparatedBy separator={<View style={tw("h-2")} />}>
        <FeedbackListItem feedback={item} disableTouchable />
        {!!item.reports && (
          <View style={tw("px-4 w-full max-w-md")}>
            <Reports
              reports={item.reports}
              feedbackId={item.id}
              style={tw("pt-4")}
              goBackOnRemove
            />
          </View>
        )}
        <View style={tw("items-center")}>
          <MainButton
            style={tw("px-4")}
            secondary
            text="Report Feedback"
            toCommon={{ screen: "MakeReport", params: { feedbackId } }}
          />
        </View>
      </SeparatedBy>
    </MediumListWidth>
  )
}
