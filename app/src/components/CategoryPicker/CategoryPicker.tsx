import { Picker } from "@react-native-picker/picker"
import React, { VFC } from "react"
import { isWeb } from "src/utils"
import { useTailwind } from "tailwind-rn"

const categoryList = [
  "Other",
  "Aaaaaa",
  "Bbbbbbb",
  "Cccccc",
  "Ddddddd",
  "Eeeeee",
]

export const CategoryPicker: VFC<{
  showAllCategories?: boolean
  category?: string
  onSelected: (category: string) => void
}> = ({ category, showAllCategories, onSelected }) => {
  const tw = useTailwind()
  const categories = [
    ...(showAllCategories ? ["All Categories"] : []),
    ...categoryList,
  ]

  return (
    <Picker
      selectedValue={category ?? categories[0]}
      onValueChange={(value) => onSelected?.(value)}
      style={isWeb && tw("p-2 text-lg bg-gray-200 border-none rounded-lg")}
    >
      {categories.map((category) => (
        <Picker.Item key={category} label={category} value={category} />
      ))}
    </Picker>
  )
}
