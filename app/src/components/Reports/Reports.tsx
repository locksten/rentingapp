import { AppText } from "@components/AppText"
import { MainButton } from "@components/MainButton"
import { DocumentType, gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import React, { useState, VFC } from "react"
import { FlatList, View, ViewStyle } from "react-native"
import { useUserDetails } from "src/auth"
import { useTailwind } from "tailwind-rn"
import { useMutation } from "urql"

const ReportFragment = gql(/* GraphQL */ `
  fragment ReportFragment on Report {
    __typename
    id
    isDismissed
    reason
  }
`)

export const DismissReports = gql(/* GraphQL */ `
  mutation dismissReports($input: DismissReportsInput!) {
    dismissReports(input: $input)
  }
`)

export const RemoveListing = gql(/* GraphQL */ `
  mutation removeListing($input: RemoveListingInput!) {
    removeListing(input: $input) {
      __typename
      id
      title
      description
      imageUrl
      dayPriceEuroCents
      category
      latitude
      longitude
    }
  }
`)

export const RemoveFeedback = gql(/* GraphQL */ `
  mutation removeFeedback($input: RemoveFeedbackInput!) {
    removeFeedback(input: $input) {
      __typename
      id
      text
      rating
    }
  }
`)

export const Reports: VFC<{
  listingId?: string
  feedbackId?: string
  reports: DocumentType<typeof ReportFragment>[]
  style?: ViewStyle
  goBackOnRemove?: boolean
}> = ({ reports, listingId, feedbackId, style, goBackOnRemove }) => {
  const tw = useTailwind()
  const navigation = useNavigation()
  const userDetails = useUserDetails()
  const [_, dismiss] = useMutation(DismissReports)
  const [__, removeListing] = useMutation(RemoveListing)
  const [___, removeFeedback] = useMutation(RemoveFeedback)
  const isDismissed = !reports.find(({ isDismissed }) => !isDismissed)

  const [localIsDismissed, setLocalIsDismissed] = useState(isDismissed)
  const [localIsRemoved, setLocalIsRemoved] = useState(false)
  return userDetails?.isAdmin ? (
    <View style={style}>
      <View style={tw("bg-white rounded-lg p-4")}>
        <FlatList
          contentContainerStyle={tw("flex-grow")}
          data={isDismissed ? [] : reports}
          ItemSeparatorComponent={() => <View style={tw("h-4")} />}
          ListFooterComponent={
            !isDismissed && !!reports.length ? (
              <View style={tw("h-4")} />
            ) : undefined
          }
          renderItem={({ item }) => <Report report={item} />}
          keyExtractor={(i) => i.id}
        />
        <View>
          <View style={tw("flex-row")}>
            <MainButton
              shouldConfirm
              secondary
              text={
                localIsRemoved
                  ? `${
                      feedbackId ? "Feedback " : listingId ? "Listing " : ""
                    }Removed`
                  : `Remove${
                      feedbackId ? " Feedback" : listingId ? " Listing" : ""
                    }`
              }
              style={tw("flex-1")}
              onPress={
                localIsRemoved
                  ? undefined
                  : async () => {
                      listingId &&
                        (await removeListing({ input: { listingId } }))
                      feedbackId &&
                        (await removeFeedback({ input: { feedbackId } }))
                      setLocalIsRemoved(true)
                      goBackOnRemove && navigation.goBack()
                    }
              }
            />
            {!isDismissed && (
              <>
                <View style={tw("w-2")} />
                <MainButton
                  secondary
                  text={
                    localIsDismissed ? "Reports Dismissed" : "Dismiss Reports"
                  }
                  style={tw("flex-1")}
                  onPress={
                    localIsDismissed
                      ? undefined
                      : async () => {
                          await dismiss({ input: { listingId, feedbackId } })
                          setLocalIsDismissed(true)
                        }
                  }
                />
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  ) : null
}

export const Report: VFC<{
  report: DocumentType<typeof ReportFragment>
}> = ({ report }) => {
  const { reason, isDismissed } = report
  const tw = useTailwind()
  return (
    <View style={isDismissed && tw("opacity-50")}>
      <View style={tw("px-2 py-1 rounded-lg bg-gray-100")}>
        <AppText style={tw("text-lg")}>{reason ? reason : "Report"}</AppText>
      </View>
    </View>
  )
}
