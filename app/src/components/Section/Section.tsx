import { SectionTitle } from "@components/SectionTitle"
import React, { FC } from "react"
import { View } from "react-native"

export const Section: FC<{ title: string }> = ({ title, children }) => {
  return (
    <View>
      <SectionTitle title={title} />
      {children}
    </View>
  )
}
