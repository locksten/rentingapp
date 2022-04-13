import { AppText } from "@components/AppText"
import { formatDistanceStrict } from "date-fns"
import React, { VFC } from "react"
import { formatMonthDayNumbers, parseJSONDate } from "src/utils"
import { useTailwind } from "tailwind-rn"

export const RentingPeriod: VFC<{
  renting: {
    scheduledStartTime?: string | null
    scheduledEndTime?: string | null
  }
}> = ({ renting: { scheduledStartTime, scheduledEndTime } }) => {
  const tw = useTailwind()
  const startDate = parseJSONDate(scheduledStartTime)
  const endDate = parseJSONDate(scheduledEndTime)
  return (
    <AppText numberOfLines={1}>
      {`for ${
        startDate && endDate
          ? formatDistanceStrict(startDate, endDate, { unit: "day" })
          : ""
      } from ${formatMonthDayNumbers(
        scheduledStartTime,
      )} to ${formatMonthDayNumbers(scheduledEndTime)}`}
    </AppText>
  )
}
