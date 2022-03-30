import { AppImage, AppImageProps } from "@components/AppImage"
import { CommonStackNavigationProp } from "@components/WithCommonStackScreens"
import { useNavigation } from "@react-navigation/native"
import React, { VFC } from "react"

export const ListingListItemImage: VFC<
  Partial<AppImageProps> & { id: string }
> = ({ id, ...props }) => {
  const { navigate } = useNavigation<CommonStackNavigationProp>()
  return (
    <AppImage
      aspectRatio={16 / 9}
      onPress={() => {
        navigate("ListingDetail", { id })
      }}
      {...props}
    />
  )
}
