import { AppText } from "@components/AppText"
import { ListingListItemTitle } from "@components/ListingListItem/ListingListItemTitle"
import { MainButton } from "@components/MainButton"
import { DocumentType, gql } from "@gql/gql"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"
import { ListingListItemImage } from "./ListingListItemImage"
import { ListingListItemOwner } from "./ListingListItemOwner"
import { ListingListItemPrice } from "./ListingListItemPrice"

export type ListingListItemType = {
  id: string
  title: string
  imageUri: string
  cost: number
}

export const items: ListingListItemType[] = [
  {
    id: "0",
    imageUri:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "Some camera or something or other",
    cost: 5,
  },
  {
    id: "1",
    imageUri:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80",
    title: "Electra Townie Beach Cruiser Bike",
    cost: 5,
  },
]

const ListingListItemFragment = gql(/* GraphQL */ `
  fragment ListingListItemFragment on Listing {
    __typename
    id
    title
    imageUrl
    dayPriceEuroCents
    owner {
      __typename
      id
      name
      isMe
      ...ListingListItemOwnerFragment
    }
  }
`)

export const ListingListItemHorizontal: VFC<{
  item: DocumentType<typeof ListingListItemFragment>
}> = ({ item }) => {
  const { id, title, imageUrl, dayPriceEuroCents, owner } = item
  const tw = useTailwind()
  return (
    <View>
      <ListingListItemImage
        id={id}
        uri={imageUrl}
        vertical
        imageStyle={tw("h-32")}
      />
      <View style={tw("pt-1 w-full")}>
        <ListingListItemTitle text={title} reserveHeight />
        <View style={tw("flex-row justify-between items-center")}>
          <ListingListItemPrice price={dayPriceEuroCents} />
          {!!owner && <ListingListItemOwner owner={owner} />}
        </View>
      </View>
    </View>
  )
}

export const ListingListItemVertical: VFC<{
  item: DocumentType<typeof ListingListItemFragment>
  renderStatus?: () => JSX.Element
}> = ({ item, renderStatus }) => {
  const { id, title, imageUrl, dayPriceEuroCents, owner } = item
  const tw = useTailwind()
  return (
    <View style={tw("px-4")}>
      <ListingListItemImage id={id} uri={imageUrl} horizontal />
      <View style={tw("pt-1 w-full")}>
        <ListingListItemTitle text={title} />
        <View style={tw("flex-row justify-between items-center")}>
          <ListingListItemPrice price={dayPriceEuroCents} />
          {renderStatus
            ? renderStatus()
            : !!owner && <ListingListItemOwner owner={owner} />}
        </View>
      </View>
    </View>
  )
}
