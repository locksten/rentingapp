import { CreateListingScreen } from "@components/CreateListingScreen"
import { FeedbackScreen } from "@components/FeedbackScreen"
import { LeaveFeedbackScreen } from "@components/LeaveFeedbackScreen"
import { ListingDetailsScreen } from "@components/ListingDetailsScreen"
import { MakeRentingRequestScreen } from "@components/MakeRentingRequestScreen"
import { MakeReportScreen } from "@components/MakeReportScreen"
import { PayForRentingScreen } from "@components/PayForRentingScreen"
import { ProfileScreen } from "@components/ProfileScreen"
import { UpdateAvailabilityScreen } from "@components/UpdateAvailabilityScreen"
import { TypedNavigator } from "@react-navigation/native"
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack"
import React, { FC } from "react"

export type CommonStackParams = {
  ListingDetail: { id: string }
  MakeRentingRequest: { id: string }
  LeaveFeedback: { rentingId: string; withReason?: boolean }
  Feedback: { feedbackId: string }
  MakeReport: { feedbackId?: string; listingId?: string }
  Profile: { userId: string }
  PayForRenting: { id: string }
  UpdateAvailability: { listingId: string }
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
        name="MakeReport"
        component={MakeReportScreen}
        options={() => ({
          presentation: "modal",
          title: "Make Report",
        })}
      />
      <Stack.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={() => ({
          title: "Feedback",
        })}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={() => ({
          title: "User",
        })}
      />
      <Stack.Screen
        name="UpdateAvailability"
        component={UpdateAvailabilityScreen}
        options={() => ({
          title: "Update Availability",
          presentation: "modal",
        })}
      />
      <Stack.Screen
        name="LeaveFeedback"
        component={LeaveFeedbackScreen}
        options={() => ({
          presentation: "modal",
          title: "Leave Feedback",
        })}
      />
    </Stack.Navigator>
  )
}
