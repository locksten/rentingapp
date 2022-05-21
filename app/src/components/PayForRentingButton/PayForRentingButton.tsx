import { MainButton } from "@components/MainButton"
import { gql } from "@gql/gql"
import { useStripe } from "@stripe/stripe-react-native"
import React, { useState, VFC } from "react"
import { toastError } from "src/toast"
import { useTailwind } from "tailwind-rn/dist"
import { useClient } from "urql"

export const RentingPaymentIntent = gql(/* GraphQL */ `
  query RentingPaymentIntent($nodeId: ID!) {
    node(id: $nodeId) {
      ... on Renting {
        id
        __typename
        paymentIntentClientSecret
      }
    }
  }
`)

export const PayForRentingButton: VFC<{ rentingId: string }> = ({
  rentingId,
}) => {
  const tw = useTailwind()
  const client = useClient()
  const [isSuccess, setIsSuccess] = useState(false)
  const { initPaymentSheet, presentPaymentSheet } = useStripe()

  const initializePaymentSheet = async () => {
    const node = (
      await client
        .query(
          RentingPaymentIntent,
          { nodeId: rentingId },
          {
            requestPolicy: "network-only",
          },
        )
        .toPromise()
    ).data?.node
    const paymentIntentClientSecret =
      node?.__typename === "Renting"
        ? node.paymentIntentClientSecret
        : undefined
    if (!paymentIntentClientSecret) return

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret,
      allowsDelayedPaymentMethods: true,
    })
    console.log(error)
    openPaymentSheet()
  }

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet()
    error ? toastError(error.message) : setIsSuccess(true)
  }

  return (
    <MainButton
      text={isSuccess ? "Paid" : "Pay"}
      onPress={
        isSuccess
          ? undefined
          : () => {
              initializePaymentSheet()
            }
      }
    />
  )
}
