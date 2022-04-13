import { AppImage, AppImageProps } from "@components/AppImage"
import { CommonStackNavigationProp } from "@components/WithCommonStackScreens"
import { useNavigation } from "@react-navigation/native"
import React, { VFC } from "react"

export const ListingListItemImage: VFC<
  { id: string } & Partial<AppImageProps>
> = ({ id, ...props }) => {
  const { navigate } = useNavigation<CommonStackNavigationProp>()
  return (
    <AppImage
      onPress={() => {
        navigate("ListingDetail", { id })
      }}
      aspectRatio={16 / 9}
      {...props}
    />
  )
}
