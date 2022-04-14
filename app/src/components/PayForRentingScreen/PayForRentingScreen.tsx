import { MainButton } from "@components/MainButton"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { VFC } from "react"
import { SafeAreaView, View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation, useQuery } from "urql"

export const RentalPaymentInfo = gql(/* GraphQL */ `
  query RentalPaymentInfo($nodeId: ID!) {
    node(id: $nodeId) {
      __typename
      id
      ... on Renting {
        listing {
          __typename
          id
          title
          imageUrl
          dayPriceEuroCents
          owner {
            __typename
            id
            name
            isMe
            ...PersonLineFragment
          }
        }
      }
    }
  }
`)

export const payForRenting = gql(/* GraphQL */ `
  mutation payForRentingc($input: PayForRentingInput!) {
    payForRenting(input: $input) {
      __typename
      id
      rentingStatus
      updatedAt
    }
  }
`)

export const PayForRentingScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "PayForRenting">
> = ({
  route: {
    params: { id },
  },
}) => {
  const tw = useTailwind()
  const navigtion = useNavigation()

  const [{ data }] = useQuery({
    query: RentalPaymentInfo,
    variables: { nodeId: id },
    requestPolicy: "cache-and-network",
  })
  const item =
    data?.node?.__typename === "Renting" ? data.node.listing : undefined

  const [_, pay] = useMutation(payForRenting)

  return (
    <SafeAreaView style={tw("flex-1 bg-white")}>
      <View style={tw("p-2")}>
        <MainButton
          onPress={async () => {
            await pay({
              input: {
                rentingId: id,
              },
            })
            navigtion.goBack()
          }}
          text={`Pay ${(item?.dayPriceEuroCents ?? 0) / 100}€ for ${
            item?.title
          }`}
        />
      </View>
    </SafeAreaView>
  )
}
