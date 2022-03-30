import { AppImage } from "@components/AppImage"
import { AppKeyboardAvoidingView } from "@components/AppKeyboardAvoidingView"
import { AppKeyboardAvoidingViewScrollView } from "@components/AppKeyboardAvoidingViewScrollView"
import { AppText } from "@components/AppText"
import { items } from "@components/ListingListItem/ListingListItem"
import { names } from "@components/PersonCard"
import { ProfilePicture } from "@components/ProfilePicture"
import { RootTabs } from "@components/RootTabNavigator"
import { SeparatedBy } from "@components/SeparatedBy"
import {
  CommonStackParams,
  WithCommonStackScreens,
} from "@components/WithCommonStackScreens"
import Ionicons from "@expo/vector-icons/Ionicons"
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"
import { useNavigation } from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"

export type MessagesScreenParams = CommonStackParams & {
  Home: undefined
  Chat: undefined
}

export type MessagesStackNavigationProp =
  NativeStackNavigationProp<MessagesScreenParams>

export const MessagesScreen: VFC<
  BottomTabScreenProps<RootTabs, "Messages">
> = () => {
  const Stack = createNativeStackNavigator<MessagesScreenParams>()
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

const chats = [
  {
    id: "1",
    personId: "1",
    itemId: "1",
    content: "Lorem ipsum dolor sit amet",
  },
  {
    id: "2",
    personId: "2",
    itemId: "2",
    content: "Lorem ipsum dolor sit amet",
  },
]

const HomeScreen: VFC<
  NativeStackScreenProps<MessagesScreenParams, "Home">
> = () => {
  const tw = useTailwind()
  const { navigate } = useNavigation<MessagesStackNavigationProp>()
  return (
    <ScrollView
      contentContainerStyle={tw(
        "flex-grow justify-between flex-col justify-start",
      )}
    >
      <SeparatedBy
        separator={<View style={tw("h-4")} />}
        start
        end
        style={tw("flex flex-col content-end")}
      >
        {[...Array(7).keys()]
          .map((i) => `${i}`)
          .map((id) => {
            const { itemId, personId, content } =
              chats[Number(id) % chats.length]
            const readStyle =
              Number(id) % 3 === 0
                ? tw("text-black font-bold")
                : tw("text-gray-600")
            return (
              <TouchableOpacity
                key={id}
                activeOpacity={0.7}
                onPress={() => {
                  navigate("Chat")
                }}
                style={tw("h-16 flex-row pr-2")}
              >
                <View style={tw("-ml-16 pr-8 items-end")}>
                  <AppImage
                    uri={items[0].imageUri}
                    aspectRatio={16 / 9}
                    imageStyle={tw("h-full rounded-r-none")}
                  />
                  <ProfilePicture
                    uri={"https://www.example.com"}
                    style={tw("absolute h-full")}
                    imageStyle={{
                      borderWidth: 0.5,
                      borderColor: "#ffffffff",
                    }}
                  />
                </View>
                <View style={tw("h-full flex-1 px-2 pb-2 justify-center")}>
                  <AppText style={tw("text-lg font-semibold")}>
                    {names[Number(personId) % names.length]}
                  </AppText>
                  <View style={tw("flex-row")}>
                    <View style={tw("flex-shrink")}>
                      <AppText numberOfLines={1} style={readStyle}>
                        {content}
                      </AppText>
                    </View>
                    <AppText style={readStyle}>{" · 2h ago"}</AppText>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
      </SeparatedBy>
    </ScrollView>
  )
}

const messages = [
  {
    id: "1",
    content: "Lorem ipsum dolor sit amet",
  },
  {
    id: "2",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  },
  {
    id: "3",
    content: "Lorem ipsum dolor sit adipi scing elit consec tetur",
  },
]

const ChatScreen: VFC<
  NativeStackScreenProps<MessagesScreenParams, "Chat">
> = () => {
  const tw = useTailwind()
  return (
    <AppKeyboardAvoidingView>
      <AppKeyboardAvoidingViewScrollView>
        <SeparatedBy separator={<View style={tw("h-4")} />} start end>
          {[...Array(15).keys()]
            .map((i) => ({
              id: `${i}`,
            }))
            .map(({ id }) => {
              const { content } = messages[Number(id) % messages.length]
              const mine = Number(id) % 2 === 0
              return (
                <View
                  key={id}
                  style={tw(
                    `px-2 ${mine ? "items-end pl-8" : "items-start pr-8"}`,
                  )}
                >
                  <View
                    style={tw(
                      `p-4 py-3 bg-primary-600 rounded-2xl ${
                        mine ? "rounded-br-none" : "rounded-bl-none"
                      }`,
                    )}
                  >
                    <AppText style={tw("text-primary-50")}>{content}</AppText>
                  </View>
                </View>
              )
            })}
        </SeparatedBy>
      </AppKeyboardAvoidingViewScrollView>
      <View style={tw("p-2 bg-white border-t border-neutral-200")}>
        <View
          style={tw(
            "h-10 w-full flex-row bg-neutral-100 rounded-full justify-end p-1 border border-neutral-200",
          )}
        >
          <TextInput style={tw("flex-1 px-2 text-base")} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              console.log("send!")
            }}
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
