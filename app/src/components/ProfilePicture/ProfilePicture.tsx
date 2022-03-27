import { AppImage } from "@components/AppImage"
import React, { VFC } from "react"

export const pfps = [
  "https://images.unsplash.com/photo-1621983266286-09645be8fd01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&q=80",
  "https://images.unsplash.com/photo-1544348817-5f2cf14b88c8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=64&q=80",
]

export const ProfilePicture: VFC<
  {
    id: string
  } & Pick<Parameters<typeof AppImage>[0], "style" | "imageStyle">
> = ({ id, ...props }) => (
  <AppImage
    uri={pfps[Number(id) % pfps.length]}
    aspectRatio={1}
    borderRadius={999}
    {...props}
  />
)
