import { RootTabs } from "@components/RootTabNavigator"
import {
  CommonStackNavigationProp,
  CommonStackParams,
} from "@components/WithCommonStackScreens"
import { useLinkProps, useNavigation } from "@react-navigation/native"
import { To } from "@react-navigation/native/lib/typescript/src/useLinkTo"
import React, { FC } from "react"
import {
  Platform,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native"

export type AppTouchableProps = TouchableOpacityProps & {
  to?: To<RootTabs, keyof RootTabs>
  toCommon?: To<CommonStackParams, keyof CommonStackParams>
  onPress?: () => void
}

export const AppTouchable: FC<AppTouchableProps> = ({
  to: toSpecific,
  toCommon,
  children,
  onPress,
  ...props
}) => {
  const tabState = useNavigation<CommonStackNavigationProp>()
    .getParent()
    ?.getState()
  const currentTabName = tabState?.routeNames[tabState?.index]
  if (typeof toCommon === "object")
    toCommon = {
      // @ts-ignore
      screen: currentTabName,
      // @ts-ignore
      params: toCommon,
    }
  const to = toSpecific ?? toCommon
  const { onPress: onLinkPress, ...linkProps } = useLinkProps<
    RootTabs & CommonStackParams
  >({
    to: to ?? {
      screen: "Browse",
      params: {
        initial: undefined,
        params: undefined,
        path: undefined,
        screen: undefined,
        state: undefined,
      },
    },
  })

  if (Platform.OS === "web" && to) {
    return (
      <View
        // @ts-ignore
        onClick={onLinkPress}
        {...linkProps}
        {...props}
      >
        {children}
      </View>
    )
  }

  return (
    <TouchableOpacity
      onPress={to ? onLinkPress : onPress}
      {...(to ? linkProps : undefined)}
      {...props}
    >
      {children}
    </TouchableOpacity>
  )
}
