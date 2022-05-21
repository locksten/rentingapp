import { ListingListItemTitle } from "@components/ListingListItem/ListingListItemTitle"
import { PersonLine } from "@components/PersonLine"
import { DocumentType, gql } from "@gql/gql"
import React, { VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn"
import { ListingListItemImage } from "./ListingListItemImage"
import { ListingListItemPrice } from "./ListingListItemPrice"

export type ListingListItemType = {
  id: string
  title: string
  imageUri: string
  cost: number
}

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
      ...PersonLineFragment
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
      <ListingListItemImage id={id} uri={imageUrl} style={tw("h-32")} />
      <View style={tw("pt-1 w-full")}>
        <ListingListItemTitle text={title} reserveHeight />
        <View style={tw("flex-row justify-between items-center")}>
          <ListingListItemPrice price={dayPriceEuroCents} />
          <PersonLine person={owner} />
        </View>
      </View>
    </View>
  )
}

export const ListingListItemVertical: VFC<{
  item: DocumentType<typeof ListingListItemFragment>
  renderStatus?: () => JSX.Element
  renderStatuses?: () => JSX.Element
}> = ({ item, renderStatus, renderStatuses }) => {
  const { id, title, imageUrl, dayPriceEuroCents, owner } = item
  const tw = useTailwind()
  return (
    <View style={tw("px-4")}>
      <ListingListItemImage id={id} uri={imageUrl} />
      <View style={tw("pt-1 w-full")}>
        <ListingListItemTitle text={title} />
        <View style={tw("flex-row justify-between items-center")}>
          <ListingListItemPrice price={dayPriceEuroCents} />
          {renderStatus ? renderStatus() : <PersonLine person={owner} />}
        </View>
        {renderStatuses?.()}
      </View>
    </View>
  )
}
