import { AppImage } from "@components/AppImage"
import { AppKeyboardAvoidingView } from "@components/AppKeyboardAvoidingView"
import { AppKeyboardAvoidingViewScrollView } from "@components/AppKeyboardAvoidingViewScrollView"
import { AppTextInput } from "@components/AppTextInput"
import { MainButton } from "@components/MainButton"
import { SeparatedBy } from "@components/SeparatedBy"
import {
  CommonStackNavigationProp,
  CommonStackParams,
} from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"
import { useMutation } from "urql"

export const createListing = gql(/* GraphQL */ `
  mutation createListing($input: ListingInput!) {
    createListing(input: $input) {
      id
      description
      imageUrl
      title
      dayPriceEuroCents
      depositEuroCents
    }
  }
`)

export const CreateListingScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "CreateListing">
> = ({}) => {
  const tw = useTailwind()
  const navigation = useNavigation<CommonStackNavigationProp>()

  const [title, onChangeTitle] = useState("")
  const [description, onChangeDescription] = useState("")
  const [price, onChangePrice] = useState("")
  const [deposit, onChangeDeposit] = useState("")
  const imageUrl =
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"

  const [_, create] = useMutation(createListing)

  return (
    <AppKeyboardAvoidingView>
      <AppKeyboardAvoidingViewScrollView>
        <View style={tw("flex-1")}>
          <View style={tw("justify-between")}>
            <AppImage
              horizontal
              uri={imageUrl}
              aspectRatio={16 / 9}
              borderRadius={0}
              imageStyle={tw("border-x-0 border-t-0")}
            />
            <View style={tw("p-4")}>
              <SeparatedBy separator={<View style={tw("h-2")} />}>
                <AppTextInput
                  label="Title"
                  value={title}
                  returnKeyType="next"
                  autoCapitalize="words"
                  onChangeText={onChangeTitle}
                />
                <AppTextInput
                  label="Description"
                  value={description}
                  returnKeyType="next"
                  multiline
                  onChangeText={onChangeDescription}
                />
                <AppTextInput
                  label="Price per day"
                  keyboardType="decimal-pad"
                  value={`€ ${price}`}
                  returnKeyType="next"
                  onChangeText={(input) =>
                    onChangePrice(`${Number.parseInt(input.slice(2)) || ""}`)
                  }
                />
                <AppTextInput
                  label="Deposit"
                  keyboardType="decimal-pad"
                  value={`€ ${deposit}`}
                  returnKeyType="done"
                  onChangeText={(input) =>
                    onChangeDeposit(`${Number.parseInt(input.slice(2)) || ""}`)
                  }
                />
                <MainButton
                  text="Create"
                  onPress={async () => {
                    await create({
                      input: {
                        title,
                        imageUrl,
                        description,
                        dayPriceEuroCents: Number(price) * 100,
                        depositEuroCents: Number(deposit) * 100,
                      },
                    })
                    navigation.goBack()
                  }}
                />
              </SeparatedBy>
            </View>
          </View>
        </View>
      </AppKeyboardAvoidingViewScrollView>
    </AppKeyboardAvoidingView>
  )
}
