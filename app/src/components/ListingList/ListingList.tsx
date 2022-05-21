import { AppFlatList } from "@components/AppFlatList"
import { ListingListItem } from "@components/ListingListItem"
import { SearchListings } from "@components/SearchScreen"
import React, { VFC } from "react"
import { filterNodes, sortedByUpdatedAt, useRefetchOnFocus } from "src/utils"
import { useTailwind } from "tailwind-rn"
import { useQuery } from "urql"

export const ListingList: VFC<{ category: string }> = ({ category }) => {
  const tw = useTailwind()

  const [{ data }, refetch] = useQuery({
    query: SearchListings,
    variables: { category },
    requestPolicy: "cache-and-network",
  })
  useRefetchOnFocus(refetch)

  const items = data?.listings?.edges
  return items?.length ? (
    <AppFlatList
      horizontal
      title={category}
      data={sortedByUpdatedAt(filterNodes(items)?.map((i) => i.node))}
      renderItem={({ item }) => (
        <ListingListItem.ListItemHorizontal item={item} />
      )}
      keyExtractor={(i) => i.id}
    />
  ) : null
}
