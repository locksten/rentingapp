import {
  CalendarRangeSelect,
  useCalendarRangeSelect,
} from "@components/CalendarRangeSelect"
import { MainButton } from "@components/MainButton"
import { CommonStackParams } from "@components/WithCommonStackScreens"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import React, { useState, VFC } from "react"
import { SafeAreaView, View } from "react-native"
import { useTailwind } from "tailwind-rn/dist"

export const MakeRentingRequestScreen: VFC<
  NativeStackScreenProps<CommonStackParams, "MakeRentingRequest">
> = ({
  route: {
    params: { listItem: item },
  },
}) => {
  const tw = useTailwind()
  const { rangeSelectCalendarProps, durationDays } = useCalendarRangeSelect()
  const [made, setMade] = useState(false)

  return (
    <SafeAreaView style={tw("flex-1 bg-white")}>
      <CalendarRangeSelect {...rangeSelectCalendarProps} />
      <View style={tw("p-2")}>
        {made ? (
          <MainButton
            secondary
            onPress={() => setMade(false)}
            text={"Cancel Request"}
          />
        ) : (
          <MainButton
            onPress={
              durationDays
                ? () => {
                    setMade(true)
                  }
                : undefined
            }
            text={
              durationDays
                ? `Request for ${
                    durationDays === 1 ? "a day" : `${durationDays} days`
                  } for ${item.cost * durationDays}€`
                : `Pick a Date`
            }
          />
        )}
      </View>
    </SafeAreaView>
  )
}
