import { AppText } from "@components/AppText"
import { eachDayOfInterval } from "date-fns"
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
  if (!startDate || !endDate) return null
  const durationDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).length
  return (
    <AppText numberOfLines={1}>
      {startDate.getTime() === endDate.getTime()
        ? `for ${formatMonthDayNumbers(endDate)}`
        : `for ${durationDays} day${
            durationDays === 1 ? "" : "s"
          } from ${formatMonthDayNumbers(
            scheduledStartTime,
          )} to ${formatMonthDayNumbers(scheduledEndTime)}`}
    </AppText>
  )
}
