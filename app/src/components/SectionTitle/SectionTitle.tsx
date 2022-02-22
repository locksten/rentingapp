import React, { VFC } from "react"
import { Text } from "react-native"
import { useTailwind } from "tailwind-rn"

export const SectionTitle: VFC<{
  title: string
}> = ({ title }) => {
  const tw = useTailwind()
  return <Text style={tw(`pl-4 pb-2 font-bold text-2xl`)}>{title}</Text>
}
