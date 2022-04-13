import { MainButton } from "@components/MainButton"
import { gql } from "@gql/gql"
import React, { VFC } from "react"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation } from "urql"

export const cancelRenting = gql(/* GraphQL */ `
  mutation cancelRenting($input: CancelRentingInput!) {
    cancelRenting(input: $input) {
      __typename
      rentingStatus
      updatedAt
      id
    }
  }
`)

export const CancelRentingButton: VFC<{ rentingId: string }> = ({
  rentingId,
}) => {
  const [__, cancel] = useMutation(cancelRenting)
  const tw = useTailwind()
  return (
    <MainButton
      secondary
      text="Cancel"
      onPress={() => {
        cancel({ input: { rentingId } })
      }}
    />
  )
}
