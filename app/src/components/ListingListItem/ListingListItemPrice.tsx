import { AppText } from "@components/AppText"
import React, { VFC } from "react"
import { useTailwind } from "tailwind-rn/dist"

export const ListingListItemPrice: VFC<{ price?: number | null }> = ({
  price,
}) => {
  const tw = useTailwind()
  return (
    <AppText style={tw("font-semibold pr-2")}>
      {`${price ? price / 100 : "__"}€/day`}
    </AppText>
  )
}
