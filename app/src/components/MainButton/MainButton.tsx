import { AppText } from "@components/AppText"
import { AppTouchable, AppTouchableProps } from "@components/AppTouchable"
import React, { useState, VFC } from "react"
import { useTailwind } from "tailwind-rn"

export type MainButtonProps = {
  text?: string
  secondary?: boolean
  onPress?: () => void
  shouldConfirm?: boolean
} & AppTouchableProps

export const MainButton: VFC<MainButtonProps> = ({
  text,
  secondary,
  style,
  onPress,
  shouldConfirm,
  ...props
}) => {
  const tw = useTailwind()
  const isEnabled = onPress || props.to || props.toCommon
  const [isConfirmation, setIsConfirmation] = useState(false)
  return (
    <AppTouchable
      style={[
        tw("py-1 px-2 justify-center rounded-lg"),
        secondary
          ? [tw("bg-primary-100"), isEnabled ? undefined : tw("bg-gray-100")]
          : [tw("bg-primary-500"), isEnabled ? undefined : tw("bg-gray-500")],
        style,
      ]}
      onPress={
        shouldConfirm
          ? onPress
            ? () => {
                if (isConfirmation) {
                  onPress?.()
                  setIsConfirmation(false)
                } else {
                  setIsConfirmation(true)
                }
              }
            : undefined
          : onPress
      }
      {...props}
    >
      <AppText
        style={[
          tw("text-lg text-center font-semibold"),
          secondary
            ? [
                tw("text-primary-600"),
                isEnabled ? undefined : tw("text-gray-600"),
              ]
            : [tw("text-white"), isEnabled ? undefined : tw("text-gray-100")],
        ]}
      >
        {isConfirmation ? "Really?" : text}
      </AppText>
    </AppTouchable>
  )
}
