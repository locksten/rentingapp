import { MainButton } from "@components/MainButton"
import { RootTabs } from "@components/RootTabNavigator"
import { gql } from "@gql/gql"
import { useLinkTo } from "@react-navigation/native"
import React, { VFC } from "react"
import { useUserDetails } from "src/auth"
import { useMutation } from "urql"

export const CreateSupportConversation = gql(/* GraphQL */ `
  mutation CreateSupportConversation {
    createSupportConversation {
      __typename
      id
    }
  }
`)

export const ContactSupportButton: VFC = () => {
  const [_, contactSupport] = useMutation(CreateSupportConversation)
  const linkTo = useLinkTo<RootTabs>()
  const userDetails = useUserDetails()
  return userDetails?.isAdmin ? null : (
    <MainButton
      text="Contact Support"
      secondary
      onPress={async () => {
        const conversationId = (await contactSupport())?.data
          ?.createSupportConversation?.id
        conversationId &&
          linkTo({
            screen: "Messages",
            params: { screen: "Chat", params: { conversationId } },
          })
      }}
    />
  )
}
