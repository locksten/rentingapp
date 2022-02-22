import { AppImage } from "@components/AppImage"
import { FeedbackListItem } from "@components/FeedbackListItem"
import { ListingListItem } from "@components/ListingListItem"
import { PersonCard } from "@components/PersonCard"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { VFC } from "react"
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useTailwind } from "tailwind-rn/dist"

const f: FeedbackListItem = {
  id: "",
  content: "Feedback feedback feedback",
  name: "Charlie Charmander",
  pfp: "https://images.unsplash.com/photo-1544348817-5f2cf14b88c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&q=80",
  rating: 5,
}

const feedback: FeedbackListItem[] = [
  {
    ...f,
    id: "1",
    content: "Feedback feedback feedback feedback feedback feedback feedback",
  },
  { ...f, id: "2" },
  { ...f, id: "3" },
  { ...f, id: "4" },
]

export const ListingDetailsScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "ListingDetail">
> = ({
  route: {
    params: { listItem: item },
  },
}) => {
  const tw = useTailwind()
  return (
    <View style={tw("flex-1")}>
      <FlatList
        ListHeaderComponent={() => <MainDetails item={item} />}
        data={feedback}
        renderItem={({ item }) => <FeedbackListItem item={item} />}
        ItemSeparatorComponent={() => (
          <View
            style={[
              tw("border-gray-200"),
              { borderWidth: StyleSheet.hairlineWidth },
            ]}
          />
        )}
        ListFooterComponent={() => <View style={tw("h-4")} />}
      />
      <View style={tw("p-2 bg-white")}>
        <TouchableOpacity
          style={tw("p-2 bg-primary-500 items-center rounded-lg")}
        >
          <Text style={tw("text-white text-lg font-semibold")}>
            Rent for €{item.cost} per day
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export const MainDetails: VFC<{ item: ListingListItem }> = ({
  item: { imageUri, title },
}) => {
  const tw = useTailwind()
  return (
    <View style={tw("justify-between")}>
      <AppImage
        horizontal
        uri={imageUri}
        aspectRatio={16 / 9}
        borderRadius={0}
      />
      <View style={tw("h-1")} />
      <Text style={tw("px-4 text-xl font-medium")}>{title}</Text>
      <View style={tw("h-2")} />
      <Text style={tw("px-6")}>
        Description Description Description Description Description Description
        Description Description Description Description Description Description
        Description Description Description Description Description Description
        Description Description Description Description Description Description
        Description Description Description Description Description Description
        Description Description
      </Text>
      <View style={tw("h-4")} />
      <View style={tw("px-4")}>
        <PersonCard
          renderBottom={() => (
            <TouchableOpacity
              style={tw("p-2 bg-primary-500 items-center rounded-lg")}
            >
              <Text style={tw("text-white font-semibold")}>Message</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={tw("h-4")} />
    </View>
  )
}
