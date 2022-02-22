import { SectionTitle } from "@components/SectionTitle"
import React from "react"
import { FlatList, FlatListProps, View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const HorizontalFlatList: <T>(
  props: FlatListProps<T> & {
    title?: string | (() => JSX.Element)
  },
) => React.ReactElement | null = ({ title, ...props }) => {
  const tw = useTailwind()
  return props.data && props.data.length ? (
    <View>
      {typeof title === "string" ? <SectionTitle title={title} /> : title?.()}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={tw("w-4")} />}
        ListHeaderComponent={() => <View style={tw("w-4")} />}
        ListFooterComponent={() => <View style={tw("w-4")} />}
        {...props}
      />
    </View>
  ) : null
}
