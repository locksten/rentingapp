import { AppImage, AppImageProps } from "@components/AppImage"
import React, { VFC } from "react"

export const ProfilePicture: VFC<Partial<AppImageProps>> = ({ ...props }) => (
  <AppImage aspectRatio={1} borderRadius={999} {...props} />
)
