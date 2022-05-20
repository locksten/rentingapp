import { useNavigation } from "@react-navigation/native"
import { format, formatISO, parseJSON } from "date-fns"
import * as Location from "expo-location"
import React, { useEffect, useReducer, useState } from "react"
import { LogBox, Platform } from "react-native"
import { useMediaQuery } from "react-responsive"
import { OperationContext } from "urql"

LogBox.ignoreLogs(["Linking requires a build-time setting `scheme`"])

export const isTruthy = <T>(val?: T | null): val is T => !!val

export const isTruthyNode = <N, T extends { node?: N | null }>(
  val?: T | null,
): val is NonNullable<T> => !!val?.node

export const filterNodes = <N, T extends { node?: N | null }>(
  edges?: (T | null)[],
) => edges?.filter(isTruthyNode)

export const useForceUpdate = () => {
  return useReducer(() => ({}), {})[1] as () => void
}

export const useRefetchOnFocus = (
  refetch: (opts?: Partial<OperationContext>) => void,
) => {
  const navigation = useNavigation()
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      refetch({ requestPolicy: "network-only" })
    })
    return unsubscribe
  }, [navigation])
}

export const parseJSONDate = (date?: string | null) =>
  date ? parseJSON(date) : undefined

export const formatISODate = (date?: Date | number | null | string) =>
  date ? formatISO(parseJSON(date), { representation: "date" }) : undefined

export const formatMonthDayNumbers = (date?: Date | number | null | string) =>
  date ? format(parseJSON(date), "MM-dd") : undefined

export const sortedByUpdatedAt = <T extends { updatedAt?: string | null }>(
  items?: T[] | null,
) =>
  items
    ? items.sort(
        (a, b) =>
          (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) -
          (a.updatedAt ? new Date(a.updatedAt).getTime() : 0),
      )
    : undefined

export const useDeviceSize = () => ({
  sm: useMediaQuery({ minDeviceWidth: 640 }),
  md: useMediaQuery({ minDeviceWidth: 768 }),
  lg: useMediaQuery({ minDeviceWidth: 1024 }),
  xl: useMediaQuery({ minDeviceWidth: 1280 }),
  "2xl": useMediaQuery({ minDeviceWidth: 1536 }),
})

export const isWeb = Platform.OS === "web"
export const isIOS = Platform.OS === "ios"
export const isAndroid = Platform.OS === "android"

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject>()
  const [error, setErrorMsg] = useState<string>()

  useEffect(() => {
    ;(async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied")
        return
      }
      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

  return { error, location }
}

export const serverUrl = `http://${isAndroid ? "10.0.2.2" : "localhost"}:4000`

export const numberOrUndefined = (n?: string) => {
  if (!n) return undefined
  const number = Number(n)
  return number === NaN ? undefined : number
}

export const useUpdateTab = () => {
  const navigation = useNavigation()
  const [s, ss] = useState(true)
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      ss(!s)
    })
    return unsubscribe
  }, [navigation, s])
}
