import { NumberInput, NumberInputProps } from "@components/NumberInput"
import React, { VFC } from "react"

export const CurrencyInput: VFC<NumberInputProps> = ({ value, ...props }) => {
  return <NumberInput value={`€ ${value === "" ? "" : value}`} {...props} />
}
