import { AppText } from "@components/AppText"
import { AppTouchable, AppTouchableProps } from "@components/AppTouchable"
import React, { VFC } from "react"
import { useTailwind } from "tailwind-rn"

export type MainButtonProps = {
  text?: string
  secondary?: boolean
  onPress?: () => void
} & AppTouchableProps

export const MainButton: VFC<MainButtonProps> = ({
  text,
  secondary,
  style,
  ...props
}) => {
  const tw = useTailwind()
  const isEnabled = props.onPress || props.to || props.toCommon
  return (
    <AppTouchable
      style={[
        tw("py-1 px-2 items-center rounded-lg"),
        secondary
          ? [tw("bg-primary-100"), isEnabled ? undefined : tw("bg-gray-100")]
          : [tw("bg-primary-500"), isEnabled ? undefined : tw("bg-gray-500")],
        style,
      ]}
      {...props}
    >
      <AppText
        style={[
          tw("text-lg font-semibold"),
          secondary
            ? [
                tw("text-primary-600"),
                isEnabled ? undefined : tw("bg-gray-600"),
              ]
            : [tw("text-white"), isEnabled ? undefined : tw("bg-gray-500")],
        ]}
      >
        {text}
      </AppText>
    </AppTouchable>
  )
}
