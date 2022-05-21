import { NumberInput, NumberInputProps } from "@components/NumberInput"
import React, { VFC } from "react"

export const CurrencyInput: VFC<NumberInputProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <NumberInput
      value={`€ ${value === "" ? "" : value}`}
      onChangeText={(input) => {
        const p = `${
          input
            .slice(2)
            .split("")
            .filter((c) => /[0-9\.]/.test(c))
            .join("") || ""
        }`
        onChange?.(
          `${
            input
              .slice(2)
              .split("")
              .filter((c) => /[0-9\.]/.test(c))
              .join("") || ""
          }`,
        )
      }}
      {...props}
    />
  )
}
