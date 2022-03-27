import { AppText } from "@components/AppText"
import React, { VFC } from "react"
import { useTailwind } from "tailwind-rn"

export const SectionTitle: VFC<{
  title: string
}> = ({ title }) => {
  const tw = useTailwind()
  return <AppText style={tw(`pl-4 pb-2 font-bold text-2xl`)}>{title}</AppText>
}
