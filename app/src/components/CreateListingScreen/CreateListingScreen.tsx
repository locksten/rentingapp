import { AppImage } from "@components/AppImage"
import { AppKeyboardAvoidingView } from "@components/AppKeyboardAvoidingView"
import { AppKeyboardAvoidingViewScrollView } from "@components/AppKeyboardAvoidingViewScrollView"
import { AppMapView } from "@components/AppMapView"
import { AppMapViewMarker } from "@components/AppMapViewMarker"
import { AppTextInput } from "@components/AppTextInput"
import { MainButton } from "@components/MainButton"
import { MediumListWidth } from "@components/MediumListWidth"
import { SeparatedBy } from "@components/SeparatedBy"
import {
  CommonStackNavigationProp,
  CommonStackParams,
} from "@components/WithCommonStackScreens"
import { gql } from "@gql/gql"
import { useNavigation } from "@react-navigation/native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useEffect, useState, VFC } from "react"
import { View } from "react-native"
import { useLocation } from "src/utils"
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

  const userLocation = useLocation().location?.coords
  const [coord, setCoord] = useState<{ latitude: number; longitude: number }>()

  useEffect(() => {
    !coord &&
      userLocation &&
      setCoord({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
      })
  }, [userLocation])

  const imageUrl =
    "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"

  const [_, create] = useMutation(createListing)

  return (
    <AppKeyboardAvoidingView>
      <AppKeyboardAvoidingViewScrollView>
        <MediumListWidth>
          <View style={tw("justify-between")}>
            <AppImage
              uri={imageUrl}
              aspectRatio={16 / 9}
              borderRadius={0}
              style={tw("border-x-0 border-t-0")}
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
                {!!AppMapView && (
                  <>
                    <View style={tw("h-4")} />
                    <View style={tw("w-full h-48")}>
                      <AppMapView
                        showsUserLocation
                        showsPointsOfInterest
                        onRegionChangeComplete={(e) => setCoord(e)}
                        initialRegion={
                          userLocation && {
                            ...userLocation,
                            latitudeDelta: 1,
                            longitudeDelta: 1,
                          }
                        }
                      >
                        {coord && AppMapViewMarker && (
                          <AppMapViewMarker
                            coordinate={{
                              latitude: coord.latitude,
                              longitude: coord.longitude,
                            }}
                            title="Selected location"
                          />
                        )}
                      </AppMapView>
                    </View>
                    <View style={tw("h-4")} />
                  </>
                )}
                <MainButton
                  text="Create"
                  onPress={async () => {
                    coord &&
                      (await create({
                        input: {
                          title,
                          imageUrl,
                          description,
                          dayPriceEuroCents: Number(price) * 100,
                          depositEuroCents: Number(deposit) * 100,
                          latitude: coord.latitude,
                          longitude: coord.longitude,
                        },
                      }))
                    navigation.goBack()
                  }}
                />
              </SeparatedBy>
            </View>
          </View>
        </MediumListWidth>
      </AppKeyboardAvoidingViewScrollView>
    </AppKeyboardAvoidingView>
  )
}
