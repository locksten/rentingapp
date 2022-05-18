import { AppImage } from "@components/AppImage"
import { AppMapView } from "@components/AppMapView"
import { AppMapViewMarker } from "@components/AppMapViewMarker"
import { AppText } from "@components/AppText"
import { FeedbackListItem } from "@components/FeedbackListItem"
import { MainButton } from "@components/MainButton"
import { PersonCard } from "@components/PersonCard"
import { Stars } from "@components/Stars"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { DocumentType, gql } from "@gql/gql"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { isWeb } from "src/utils"
import { useTailwind } from "tailwind-rn/dist"
import { useQuery } from "urql"

export const Listing = gql(/* GraphQL */ `
  query Listing($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on Listing {
        id
        title
        description
        imageUrl
        dayPriceEuroCents
        depositEuroCents
        rating
        category
        latitude
        longitude
        owner {
          isMe
          ...PersonCardFragment
        }
        feedback {
          edges {
            node {
              ...FeedbackListItemFragment
            }
          }
        }
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

  const [{ data, error }] = useQuery({
    query: Listing,
    variables: { nodeId: id },
    requestPolicy: "cache-and-network",
  })
  const item = data?.node?.__typename === "Listing" ? data.node : undefined

  if (error || !item?.__typename)
    return <AppText>Error {error?.message}</AppText>

  return (
    <View style={tw("flex-1")}>
      <FlatList
        ListHeaderComponent={<MainDetails item={item} />}
        data={item.feedback?.edges?.map((e) => e?.node)}
        renderItem={({ item }) =>
          item ? <FeedbackListItem feedback={item} /> : null
        }
        ItemSeparatorComponent={() => (
          <View
            style={[
              tw("border-neutral-200"),
              { borderWidth: StyleSheet.hairlineWidth },
            ]}
          />
        )}
        ListFooterComponent={() => <View style={tw("h-4")} />}
      />
      {!item.owner?.isMe && item.dayPriceEuroCents && (
        <View style={tw("p-2 bg-white")}>
          <MainButton
            text={`Rent for ${item.dayPriceEuroCents / 100}€ per day`}
            toCommon={{ screen: "MakeRentingRequest", params: { id: item.id } }}
          />
        </View>
      )}
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
}> = ({
  item: {
    imageUrl,
    title,
    description,
    owner,
    rating,
    feedback,
    latitude,
    longitude,
    category,
    id,
  },
}) => {
  const tw = useTailwind()
  return (
    <View style={tw("items-center")}>
      {isWeb && <View style={tw("h-2")} />}
      <AppImage
        uri={imageUrl}
        aspectRatio={16 / 9}
        borderRadius={isWeb ? undefined : 0}
        style={[tw("border-x-0 border-t-0 w-full max-w-xl")]}
      />
      <View style={tw("w-full items-center max-w-xl")}>
        <View style={tw("h-1")} />
        <View style={tw("w-full px-4")}>
          <AppText>
            <AppText style={tw("text-xl font-medium")}>{title}</AppText>
            {!!category && (
              <AppText style={tw("text-xl font-medium text-gray-500")}>
                {`   #${category}`}
              </AppText>
            )}
          </AppText>
          <View style={tw("h-1")} />
          {!!description && <AppText>{description}</AppText>}
        </View>
        {!!AppMapView &&
          latitude !== null &&
          latitude !== undefined &&
          longitude !== null &&
          longitude !== undefined && (
            <>
              <View style={tw("h-4")} />
              <View style={tw("px-4 w-full h-48")}>
                <AppMapView
                  showsPointsOfInterest
                  initialRegion={{
                    latitude,
                    longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                  }}
                >
                  {AppMapViewMarker && (
                    <AppMapViewMarker
                      coordinate={{
                        latitude,
                        longitude,
                      }}
                    />
                  )}
                </AppMapView>
              </View>
            </>
          )}
        <View style={tw("h-4")} />
        <View style={tw("px-4 w-full max-w-md")}>
          {!!owner && <PersonCard person={owner} />}
        </View>
        <View style={tw("h-4")} />
        <MainButton
          style={tw("px-4")}
          secondary
          text="Report Listing"
          toCommon={{ screen: "MakeReport", params: { listingId: id } }}
        />
        <View style={tw("h-4")} />
      </View>
      {!!feedback?.edges.length && (
        <View
          style={tw("flex-row bg-white p-2 justify-center items-center w-full")}
        >
          {!!rating && (
            <AppText style={tw("pt-0.5")}>{rating.toFixed(1)}</AppText>
          )}
          <View style={tw("w-2")} />
          <Stars stars={rating} />
        </View>
      )}
    </View>
  )
}
