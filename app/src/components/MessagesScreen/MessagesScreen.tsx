import { AppFlatList } from "@components/AppFlatList"
import { AppText } from "@components/AppText"
import { AppTouchable } from "@components/AppTouchable"
import { ChatScreen } from "@components/ChatScreen"
import { ContactSupportButton } from "@components/ContactSupportButton"
import { EmptyListIndicator } from "@components/EmptyListIndicator"
import { MediumListWidth } from "@components/MediumListWidth"
import { ProfilePicture } from "@components/ProfilePicture"
import { RootTabs } from "@components/RootTabNavigator"
import {
  CommonStackParams,
  WithCommonStackScreens,
} from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import { formatDistanceToNowStrict } from "date-fns"
import React, { VFC } from "react"
import { View } from "react-native"
import { isTruthy, parseJSONDate, useRefetchOnFocus } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

export type MessagesScreenParams = CommonStackParams & {
  Home: undefined
  Chat: { conversationId?: string; listingId?: string; recipientId?: string }
}

export type MessagesStackNavigationProp =
  NativeStackNavigationProp<MessagesScreenParams>

const Stack = createNativeStackNavigator<MessagesScreenParams>()
export const MessagesScreen: VFC<
  BottomTabScreenProps<RootTabs, "Messages">
> = () => {
  return (
    <WithCommonStackScreens stack={Stack}>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          headerBackButtonMenuEnabled: true,
          headerBackTitle: "Messages",
          animationTypeForReplace: "push",
        }}
        name="Chat"
        component={ChatScreen}
      />
    </WithCommonStackScreens>
  )
}

export const MyConversations = gql(/* GraphQL */ `
  query MyConversations {
    me {
      __typename
      id
      conversations {
        edges {
          node {
            __typename
            id
            createdAt
            otherParticipant {
              __typename
              id
              imageUrl
              name
              isAdmin
            }
            latestMessage {
              __typename
              id
              text
              createdAt
              sender {
                __typename
                id
                name
                imageUrl
              }
            }
          }
        }
      }
    }
  }
`)

const HomeScreen: VFC<
  NativeStackScreenProps<MessagesScreenParams, "Home">
> = () => {
  const tw = useTailwind()

  const [{ data }, refetch] = useQuery({
    query: MyConversations,
    requestPolicy: "cache-and-network",
  })
  const items = data?.me?.conversations?.edges
  useRefetchOnFocus(refetch)

  return (
    <MediumListWidth>
      <AppFlatList
        ListHeaderComponentStyle={tw("px-4 py-4")}
        ListHeaderComponent={<ContactSupportButton />}
        ListEmptyComponent={EmptyListIndicator}
        contentContainerStyle={tw("flex-grow")}
        data={items?.map((i) => i?.node).filter(isTruthy)}
        renderItem={({ item }) => {
          const { latestMessage } = item
          const lastMessageDate = parseJSONDate(latestMessage?.createdAt)
          const readStyle = true
            ? tw("text-gray-600")
            : tw("text-black font-bold")
          return (
            <AppTouchable
              to={{
                screen: "Messages",
                params: { screen: "Chat", params: { conversationId: item.id } },
              }}
              style={tw("h-16 flex-row pr-2")}
            >
              <View style={tw("pl-4")}>
                <ProfilePicture
                  uri={item.otherParticipant?.imageUrl}
                  style={tw("h-full")}
                />
              </View>

              <View style={tw("h-full flex-1 px-4 pb-2 justify-center")}>
                <AppText style={tw("text-lg font-semibold")}>
                  {item.otherParticipant?.isAdmin && (
                    <View style={tw("justify-end pr-2")}>
                      <View style={tw("px-1 rounded-lg bg-orange-100")}>
                        <AppText
                          numberOfLines={1}
                          style={tw("text-sm font-semibold text-orange-700")}
                        >
                          {"Admin"}
                        </AppText>
                      </View>
                    </View>
                  )}
                  {item.otherParticipant?.name}
                </AppText>
                <View style={tw("flex-row")}>
                  <View style={tw("flex-shrink")}>
                    <AppText numberOfLines={1} style={readStyle}>
                      {latestMessage?.text}
                    </AppText>
                  </View>
                  {lastMessageDate && (
                    <AppText style={readStyle}>{` · ${formatDistanceToNowStrict(
                      lastMessageDate,
                      { addSuffix: true },
                    )}`}</AppText>
                  )}
                </View>
              </View>
            </AppTouchable>
          )
        }}
        keyExtractor={(i) => i.id}
      />
    </MediumListWidth>
  )
}
