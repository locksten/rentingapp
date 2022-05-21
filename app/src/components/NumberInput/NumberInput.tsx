import { AppTextInput, AppTextInputProps } from "@components/AppTextInput"
import React, { VFC } from "react"

export type NumberInputProps = Omit<AppTextInputProps, "onChange"> & {
  onChange?: (value: string) => void
}

export const NumberInput: VFC<NumberInputProps> = ({
  onChange,
  value,
  ...props
}) => {
  return (
    <AppTextInput
      value={`${value === "" ? "" : value}`}
      keyboardType="decimal-pad"
      onChangeText={(input) => onChange?.(`${Number.parseInt(input) || ""}`)}
      {...props}
    />
  )
}
