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
import { imageUploadStateMessage, useUploadImage } from "src/imageUpload"
import { isWeb, useLocation } from "src/utils"
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
> = () => {
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

  const { imageUpload, pickImage } = useUploadImage("listing")

  const [_, create] = useMutation(createListing)

  return (
    <AppKeyboardAvoidingView>
      <AppKeyboardAvoidingViewScrollView>
        <MediumListWidth>
          <View style={tw("justify-between")}>
            <View style={isWeb && tw("p-4")}>
              <AppImage
                uri={
                  imageUpload.status === "uploaded"
                    ? imageUpload.uri
                    : undefined
                }
                onPress={pickImage}
                aspectRatio={16 / 9}
                borderRadius={isWeb ? 8 : 0}
                text={
                  imageUpload.status === "uploaded"
                    ? undefined
                    : imageUploadStateMessage[imageUpload.status]
                }
                style={[tw("border-x-0 border-t-0"), isWeb && tw("border-b-0")]}
              />
            </View>
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
                      imageUpload.status === "uploaded" &&
                      (await create({
                        input: {
                          title,
                          imageUrl: imageUpload.uri,
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
