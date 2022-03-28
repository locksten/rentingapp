import { AppImage } from "@components/AppImage"
import { AppText } from "@components/AppText"
import { FeedbackListItem } from "@components/FeedbackListItem"
import { MainButton } from "@components/MainButton"
import { PersonCard } from "@components/PersonCard"
import { RootTabsNavigationProp } from "@components/RootTabNavigator"
import {
  CommonStackNavigationProp,
  CommonStackParams,
} from "@components/WithCommonStackScreens"
import { DocumentType, gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

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

export const Listing = gql(/* GraphQL */ `
  query Listing($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on Listing {
        title
        description
        imageUrl
        dayPriceEuroCents
      }
    }
  }
`)

export const ListingDetailsScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "ListingDetail">
> = ({
  route: {
    params: { id },
  },
}) => {
  const tw = useTailwind()
  const { navigate } = useNavigation<CommonStackNavigationProp>()

  const [{ data, fetching, error }] = useQuery({
    query: Listing,
    variables: { nodeId: id },
    requestPolicy: "cache-and-network",
  })
  const item = data?.node?.__typename === "Listing" ? data.node : undefined

  if (fetching) return <AppText>Loading</AppText>
  if (error || !item?.__typename)
    return <AppText>Error {error?.message}</AppText>

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
          text={`Rent for ${item.dayPriceEuroCents}€ per day`}
          onPress={() =>
            navigate("MakeRentingRequest", { id: item.id, listItem: {} as any })
          }
        />
      </View>
    </View>
  )
}

export const MainDetails: VFC<{
  item: Omit<
    NonNullable<DocumentType<typeof Listing>["node"]> & {
      __typename: "Listing"
    },
    "__typename"
  >
}> = ({ item: { id, imageUrl, title, description } }) => {
  const tw = useTailwind()
  const { navigate } = useNavigation<RootTabsNavigationProp>()
  return (
    <View style={tw("justify-between")}>
      <AppImage
        horizontal
        uri={imageUrl}
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
      {description && <AppText style={tw("px-4")}>{description}</AppText>}
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
