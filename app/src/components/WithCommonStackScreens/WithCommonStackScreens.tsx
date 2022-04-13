import { CreateListingScreen } from "@components/CreateListingScreen"
import { LeaveFeedbackScreen } from "@components/LeaveFeedbackScreen"
import { ListingDetailsScreen } from "@components/ListingDetailsScreen"
import { MakeRentingRequestScreen } from "@components/MakeRentingRequestScreen"
import { PayForRentingScreen } from "@components/PayForRentingScreen"
import { TypedNavigator } from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import React, { FC } from "react"

export type CommonStackParams = {
  ListingDetail: { id: string }
  MakeRentingRequest: { id: string }
  LeaveFeedback: { id: string }
  PayForRenting: { id: string }
  CreateListing: undefined
}

const GenericlessCommonStack = () =>
  createNativeStackNavigator<CommonStackParams>()
type CommonStack = ReturnType<typeof GenericlessCommonStack>

export type CommonStackNavigationProp =
  NativeStackNavigationProp<CommonStackParams>

export const WithCommonStackScreens: FC<{
  // https://github.com/react-navigation/react-navigation/issues/8139
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stack: TypedNavigator<any, any, any, any, any>
}> = ({ stack, children }) => {
  const Stack = stack as CommonStack
  return (
    <Stack.Navigator>
      {children}
      <Stack.Screen
        name="ListingDetail"
        component={ListingDetailsScreen}
        options={() => ({
          title: "Listing",
        })}
      />
      <Stack.Screen
        name="MakeRentingRequest"
        component={MakeRentingRequestScreen}
        options={() => ({
          title: "Request",
          presentation: "modal",
        })}
      />
      <Stack.Screen
        name="PayForRenting"
        component={PayForRentingScreen}
        options={() => ({
          title: "Pay",
          presentation: "modal",
        })}
      />
      <Stack.Screen
        name="CreateListing"
        component={CreateListingScreen}
        options={() => ({
          title: "Create Listing",
        })}
      />
      <Stack.Screen
        name="LeaveFeedback"
        component={LeaveFeedbackScreen}
        options={() => ({
          title: "Leave Feedback",
        })}
      />
    </Stack.Navigator>
  )
}
