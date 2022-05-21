import { AppFlatList } from "@components/AppFlatList"
import { AppMapView } from "@components/AppMapView"
import { AppMapViewMarker } from "@components/AppMapViewMarker"
import { AppText } from "@components/AppText"
import { AppTextInput } from "@components/AppTextInput"
import { BrowseScreenParams } from "@components/BrowseScreen"
import { CategoryPicker } from "@components/CategoryPicker"
import { CurrencyInput } from "@components/CurrencyInput"
import { ListingListItem } from "@components/ListingListItem"
import { MediumListWidth } from "@components/MediumListWidth"
import { SeparatedBy } from "@components/SeparatedBy"
import { DocumentType, gql } from "@gql/gql"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { VFC, useState } from "react"
import { View } from "react-native"
import { filterNodes, numberOrUndefined, sortedByUpdatedAt } from "src/utils"
import { useTailwind } from "tailwind-rn"
import { useQuery } from "urql"

const ListingMapMarkerFragment = gql(/* GraphQL */ `
  fragment ListingMapMarkerFragment on Listing {
    __typename
    id
    title
    dayPriceEuroCents
    latitude
    longitude
  }
`)

export const SearchListings = gql(/* GraphQL */ `
  query SearchListings(
    $searchTerm: String
    $toPriceEuroCents: Int
    $fromPriceEuroCents: Int
    $category: String
    $latitudeMin: Float
    $latitudeMax: Float
    $longitudeMin: Float
    $longitudeMax: Float
  ) {
    listings(
      searchTerm: $searchTerm
      toPriceEuroCents: $toPriceEuroCents
      fromPriceEuroCents: $fromPriceEuroCents
      category: $category
      latitudeMin: $latitudeMin
      latitudeMax: $latitudeMax
      longitudeMin: $longitudeMin
      longitudeMax: $longitudeMax
    ) {
      edges {
        node {
          __typename
          id
          updatedAt
          ...ListingListItemFragment
          ...ListingMapMarkerFragment
        }
      }
    }
  }
`)

export const SearchScreen: VFC<
  NativeStackScreenProps<BrowseScreenParams, "Search">
> = () => {
  const tw = useTailwind()

  const [category, setCategory] = useState("All Categories")
  const [priceFrom, onChangePriceFrom] = useState("")
  const [priceTo, onChangePriceTo] = useState("")
  const [area, onChangeArea] = useState<Area>()
  const [searchTerm, onChangeSearchTerm] = useState("")

  const priceToNumber = numberOrUndefined(priceTo)
  const priceFromNumber = numberOrUndefined(priceFrom)
  const [{ data, error }] = useQuery({
    query: SearchListings,
    variables: {
      searchTerm,
      fromPriceEuroCents: priceFromNumber ? priceFromNumber * 100 : undefined,
      toPriceEuroCents: priceToNumber ? priceToNumber * 100 : undefined,
      category,
      latitudeMin: area?.latitudeMin,
      latitudeMax: area?.latitudeMax,
      longitudeMin: area?.longitudeMin,
      longitudeMax: area?.longitudeMax,
    },
    requestPolicy: "cache-and-network",
  })
  const items = data?.listings?.edges
  if (error) return <AppText>Error {error.message}</AppText>

  return (
    <MediumListWidth>
      <AppFlatList
        ListHeaderComponent={
          <SeparatedBy
            style={tw("px-4")}
            separator={<View style={tw("h-4")} />}
            start
            end
          >
            <CategoryPicker
              showAllCategories
              category={category}
              onSelected={setCategory}
            />
            <View style={tw("flex-row")}>
              <CurrencyInput
                containerStyle={tw("flex-1")}
                label="From"
                value={priceFrom}
                onChange={onChangePriceFrom}
              />
              <View style={tw("w-2")} />
              <CurrencyInput
                containerStyle={tw("flex-1")}
                label="To"
                value={priceTo}
                onChange={onChangePriceTo}
              />
            </View>
            <AppTextInput
              label="Search"
              value={searchTerm}
              returnKeyType="done"
              autoCapitalize="sentences"
              onChangeText={onChangeSearchTerm}
            />
            <SearchMap
              listings={filterNodes(items)?.map((i) => i.node) ?? []}
              onAreaChange={onChangeArea}
            />
          </SeparatedBy>
        }
        contentContainerStyle={tw("flex-grow")}
        ListEmptyComponent={
          <View style={tw("flex-1 justify-center pt-4 pb-8")}>
            <AppText style={tw("text-center text-xl font-bold text-gray-400")}>
              No Results
            </AppText>
          </View>
        }
        data={sortedByUpdatedAt(filterNodes(items)?.map((i) => i.node))}
        renderItem={({ item }) => (
          <ListingListItem.ListItemVertical item={item} />
        )}
        keyExtractor={(i) => i.id}
      />
    </MediumListWidth>
  )
}

type Area = {
  latitudeMin: number
  latitudeMax: number
  longitudeMin: number
  longitudeMax: number
}

const SearchMap: VFC<{
  listings: DocumentType<typeof ListingMapMarkerFragment>[]
  onAreaChange?: (value: Area) => void
}> = ({ listings, onAreaChange }) => {
  const tw = useTailwind()
  return AppMapView ? (
    <View style={tw("w-full h-48")}>
      {
        <AppMapView
          showsUserLocation
          showsPointsOfInterest
          onRegionChangeComplete={(e) => {
            onAreaChange?.({
              latitudeMin: e.latitude - e.latitudeDelta / 2,
              latitudeMax: e.latitude + e.latitudeDelta / 2,
              longitudeMin: e.longitude - e.longitudeDelta / 2,
              longitudeMax: e.longitude + e.longitudeDelta / 2,
            })
          }}
        >
          {listings.map(
            ({ id, latitude, longitude, title, dayPriceEuroCents }) =>
              !!AppMapViewMarker &&
              latitude !== undefined &&
              latitude !== null &&
              longitude !== undefined &&
              longitude !== null &&
              dayPriceEuroCents !== undefined &&
              dayPriceEuroCents !== null &&
              title !== undefined &&
              title !== null && (
                <AppMapViewMarker
                  key={id}
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  title={`${dayPriceEuroCents / 100}€ ${title}`}
                />
              ),
          )}
        </AppMapView>
      }
    </View>
  ) : null
}
