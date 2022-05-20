import { MainButton } from "@components/MainButton"
import { gql } from "@gql/gql"
import { useStripe } from "@stripe/stripe-react-native"
import React, { useState, VFC } from "react"
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
    console.log("Initialize payment")
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
    if (error) {
      console.log(`Error code: ${error.code}`, error.message)
    } else {
      setIsSuccess(true)
    }
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
