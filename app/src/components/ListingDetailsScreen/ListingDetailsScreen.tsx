import { AppImage } from "@components/AppImage"
import { AppText } from "@components/AppText"
import { FeedbackListItem } from "@components/FeedbackListItem"
import { ListingListItem } from "@components/ListingListItem"
import { MainButton } from "@components/MainButton"
import { PersonCard } from "@components/PersonCard"
import { RootTabsNavigationProp } from "@components/RootTabNavigator"
import {
  CommonStackNavigationProp,
  CommonStackParams,
} from "@components/WithCommonStackScreens"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"

const f: FeedbackListItem = {
  id: "",
  content: "Feedback feedback feedback",
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
  const { navigate } = useNavigation<CommonStackNavigationProp>()
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
        <MainButton
          text={`Rent for ${item.cost}€ per day`}
          onPress={() =>
            navigate("MakeRentingRequest", { id: item.id, listItem: item })
          }
        />
      </View>
    </View>
  )
}

export const MainDetails: VFC<{ item: ListingListItem }> = ({
  item: { imageUri, title, id },
}) => {
  const tw = useTailwind()
  const { navigate } = useNavigation<RootTabsNavigationProp>()
  return (
    <View style={tw("justify-between")}>
      <AppImage
        horizontal
        uri={imageUri}
        aspectRatio={16 / 9}
        borderRadius={0}
        imageStyle={tw("border-x-0 border-t-0")}
      />
      <View style={tw("h-1")} />
      <AppText style={tw("px-4 text-xl font-medium")}>{title}</AppText>
      <View style={tw("h-1")} />
      <View style={tw("px-4 flex-row items-center opacity-60")}>
        <AppText style={tw("font-medium")}>{"Some City, 12km away"}</AppText>
      </View>
      <View style={tw("h-1")} />
      <AppText style={tw("px-4")}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium
        vel orci ac tincidunt. Maecenas eu leo at arcu tempor dictum fermentum
        vel felis. Sed sit amet tincidunt massa, eu pretium arcu. In et eros sit
        amet enim pellentesque porttitor. Morbi imperdiet mollis placerat. Morbi
        aliquet tortor viverra, ultricies purus nec, mollis orci.
      </AppText>
      <View style={tw("h-4")} />
      <View style={tw("px-4")}>
        <PersonCard
          id={id}
          renderBottom={() => (
            <MainButton
              secondary
              text={"Message"}
              onPress={() => {
                navigate("Messages", { screen: "Chat", initial: false })
              }}
            />
          )}
        />
      </View>
      <View style={tw("h-4")} />
    </View>
  )
}
