import { SectionTitle } from "@components/SectionTitle"
import React from "react"
import { FlatList, FlatListProps, View } from "react-native"
import { useTailwind } from "tailwind-rn"

export const AppFlatList: <T>(
  props: FlatListProps<T> & {
    title?: string | (() => JSX.Element)
  },
) => React.ReactElement | null = ({ title, ...props }) => {
  const tw = useTailwind()
  const separator = <View style={tw(props.horizontal ? "w-4" : "h-4")} />
  return props.data && props.data.length ? (
    <View>
      {typeof title === "string" ? <SectionTitle title={title} /> : title?.()}
      <FlatList
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => separator}
        ListHeaderComponent={() => separator}
        ListFooterComponent={() => separator}
        {...props}
      />
    </View>
  ) : null
}
