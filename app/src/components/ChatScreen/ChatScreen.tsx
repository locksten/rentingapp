import { AppFlatList } from "@components/AppFlatList"
import { AppKeyboardAvoidingView } from "@components/AppKeyboardAvoidingView"
import { AppText } from "@components/AppText"
import { MessagesScreenParams } from "@components/MessagesScreen"
import { ProfilePicture } from "@components/ProfilePicture"
import Ionicons from "@expo/vector-icons/Ionicons"
import { gql } from "@gql/gql"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { TextInput, TouchableOpacity, View } from "react-native"
import { toastError } from "src/toast"
import { isTruthy, useRefetchOnFocus } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation, useQuery } from "urql"

export const ConversationMessages = gql(/* GraphQL */ `
  query ConversationMessages($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on Conversation {
        id
        createdAt
        messages {
          edges {
            node {
              id
              text
              createdAt
              sender {
                imageUrl
                id
                isMe
              }
            }
          }
        }
      }
    }
  }
`)

export const sendMessage = gql(/* GraphQL */ `
  mutation sendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      __typename
      id
      conversation {
        __typename
        id
      }
    }
  }
`)

export const ChatScreen: VFC<
  NativeStackScreenProps<MessagesScreenParams, "Chat">
> = ({
  route: {
    params: { recipientId, listingId, ...params },
  },
}) => {
  const tw = useTailwind()
  const [conversationId, setConversationId] = useState<string | undefined>(
    params.conversationId,
  )
  const [{ data }, refetch] = useQuery({
    query: ConversationMessages,
    variables: conversationId ? { nodeId: conversationId } : undefined,
    requestPolicy: "cache-and-network",
  })
  const item = data?.node?.__typename === "Conversation" ? data.node : undefined
  useRefetchOnFocus(refetch)

  const [_, send] = useMutation(sendMessage)
  const [text, onChangeText] = useState("")
  const submit = async () => {
    if (!text) {
      toastError("Message cannot be empty")
      return
    } else if (text.length > 1000) {
      toastError("Message cannot exceed 1000 characters")
      return
    }
    const submittedConversationId = (
      await send({ input: { conversationId, recipientId, text } })
    ).data?.sendMessage?.conversation?.id
    onChangeText("")
    if (!submittedConversationId) {
      toastError()
      return
    }
    !conversationId && setConversationId(submittedConversationId)
    refetch({ requestPolicy: "network-only" })
  }

  return (
    <AppKeyboardAvoidingView>
      <AppFlatList
        ItemSeparatorComponent={() => <View style={tw("h-1")} />}
        ListEmptyComponent={<></>}
        inverted
        data={item?.messages?.edges.map((i) => i?.node).filter(isTruthy)}
        renderItem={({ item }) => (
          <View
            style={tw(
              `px-2 ${
                item.sender?.isMe ? "items-end pl-8" : "items-start pr-8"
              }`,
            )}
          >
            <View style={[tw("items-end flex-row")]}>
              {!item.sender?.isMe && (
                <View style={tw("h-8 w-9 flex-row")}>
                  <ProfilePicture uri={item.sender?.imageUrl} />
                </View>
              )}
              <View
                style={tw(
                  `p-4 py-3 bg-primary-600 rounded-2xl ${
                    item.sender?.isMe ? "rounded-br-none" : "rounded-bl-none"
                  }`,
                )}
              >
                <AppText style={tw("text-primary-50")}>{item.text}</AppText>
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={tw("flex-grow")}
      />
      <View style={tw("p-2 bg-white border-t border-neutral-200")}>
        <View
          style={tw(
            "h-10 w-full flex-row bg-neutral-100 rounded-full justify-end p-1 border border-neutral-200",
          )}
        >
          <TextInput
            style={tw("flex-1 px-2 text-base")}
            value={text}
            onChangeText={onChangeText}
            onSubmitEditing={submit}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={submit}
            style={[
              tw("bg-primary-600 rounded-full items-center justify-center"),
              { aspectRatio: 1 },
            ]}
          >
            <Ionicons
              name={"send"}
              color={"white"}
              size={16}
              style={tw("pl-0.5")}
            />
          </TouchableOpacity>
        </View>
      </View>
    </AppKeyboardAvoidingView>
  )
}
