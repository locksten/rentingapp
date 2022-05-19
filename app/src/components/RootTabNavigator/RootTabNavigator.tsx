import { AccountScreen, AccountScreenParams } from "@components/AccountScreen"
import { BrowseScreen, BrowseScreenParams } from "@components/BrowseScreen"
import {
  MessagesScreen,
  MessagesScreenParams,
} from "@components/MessagesScreen"
import {
  MyListingsScreen,
  MyListingsScreenParams,
} from "@components/MyListingsScreen"
import {
  MyRentalsScreen,
  MyRentalsScreenParams,
} from "@components/MyRentalsScreen"
import { ReportsScreen, ReportsScreenParams } from "@components/ReportsScreen"
import Ionicons from "@expo/vector-icons/Ionicons"
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import { NavigatorScreenParams } from "@react-navigation/native"
import { VFC } from "react"
import { useCurrentUser } from "src/auth"
import { useUserDetails } from "src/utils"

export type RootTabs = {
  Browse: NavigatorScreenParams<BrowseScreenParams>
  Messages: NavigatorScreenParams<MessagesScreenParams>
  Account: NavigatorScreenParams<AccountScreenParams>
  MyListings: NavigatorScreenParams<MyListingsScreenParams>
  MyRentals: NavigatorScreenParams<MyRentalsScreenParams>
  Reports: NavigatorScreenParams<ReportsScreenParams>
}

export type RootTabsNavigationProp = BottomTabNavigationProp<RootTabs>

export const RootTabNavigator: VFC = () => {
  const Tab = createBottomTabNavigator<RootTabs>()
  const user = useCurrentUser()
  const userDetails = useUserDetails()

  return (
    <Tab.Navigator
      initialRouteName={"Browse"}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Browse":
              return <Ionicons name={"md-search"} color={color} size={size} />
            case "Messages":
              return <Ionicons name={"mail"} color={color} size={size} />
            case "MyListings":
              return <Ionicons name={"arrow-up"} color={color} size={size} />
            case "MyRentals":
              return <Ionicons name={"arrow-down"} color={color} size={size} />
            case "Account":
              return <Ionicons name={"person"} color={color} size={size} />
            case "Reports":
              return <Ionicons name={"ios-warning"} color={color} size={size} />
          }
        },
      })}
    >
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{ title: "Browse" }}
      />
      {!!user && (
        <>
          <Tab.Screen
            name="Messages"
            component={MessagesScreen}
            options={{ title: "Messages" }}
          />
          <Tab.Screen
            name="MyRentals"
            component={MyRentalsScreen}
            options={{
              title: "My Rentals",
            }}
          />
          <Tab.Screen
            name="MyListings"
            component={MyListingsScreen}
            options={{
              title: "My Listings",
            }}
          />
        </>
      )}
      {userDetails?.isAdmin && (
        <Tab.Screen
          name="Reports"
          component={ReportsScreen}
          options={{
            title: "Reports",
          }}
        />
      )}
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          title: "Account",
        }}
      />
    </Tab.Navigator>
  )
}
