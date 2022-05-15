import { AppImage, AppImageProps } from "@components/AppImage"
import React, { VFC } from "react"

export const ListingListItemImage: VFC<
  { id: string } & Partial<AppImageProps>
> = ({ id, ...props }) => {
  return (
    <AppImage
      toCommon={{ screen: "ListingDetail", params: { id } }}
      aspectRatio={16 / 9}
      {...props}
    />
  )
}
