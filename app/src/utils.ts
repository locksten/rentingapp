import { useNavigation } from "@react-navigation/native"
import { format, formatISO, parseJSON } from "date-fns"
import React from "react"
import { useReducer } from "react"
import { OperationContext } from "urql"

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

export const sortByUpdatedAt = <T extends { updatedAt?: string | null }>(
  items?: T[] | null,
) =>
  items
    ? items.sort(
        (a, b) =>
          (b.updatedAt ? new Date(b.updatedAt).getTime() : 0) -
          (a.updatedAt ? new Date(a.updatedAt).getTime() : 0),
      )
    : undefined
