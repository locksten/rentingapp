import Ionicons from "@expo/vector-icons/Ionicons"
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs"
import { NavigatorScreenParams } from "@react-navigation/native"
import { VFC } from "react"
import { AccountScreenParams, AccountScreen } from "@components/AccountScreen"
import { BrowseScreen, BrowseScreenParams } from "@components/BrowseScreen"
import {
  MessagesScreen,
  MessagesScreenParams,
} from "@components/MessagesScreen"

export type RootTabs = {
  Browse: NavigatorScreenParams<BrowseScreenParams>
  Messages: NavigatorScreenParams<MessagesScreenParams>
  Account: NavigatorScreenParams<AccountScreenParams>
}

export type RootTabsNavigationProp = BottomTabNavigationProp<RootTabs>

export const RootTabNavigator: VFC = () => {
  const Tab = createBottomTabNavigator<RootTabs>()
  const isLoggedIn = false
  // const { data: account } = useAccountDetail()
  return isLoggedIn === undefined ? null : (
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
            case "Account":
              return <Ionicons name={"person"} color={color} size={size} />
          }
        },
      })}
    >
      <Tab.Screen
        name="Browse"
        component={BrowseScreen}
        options={{ title: "Browse" }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{ title: "Messages" }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          // title: account?.username || "Account",
          title: "Account",
        }}
      />
    </Tab.Navigator>
  )
}
