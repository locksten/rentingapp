import { AppText } from "@components/AppText"
import React, { VFC } from "react"
import { formatMonthDayNumbers } from "src/utils"
import { useTailwind } from "tailwind-rn"

export const RentingPeriod: VFC<{
  renting: {
    scheduledStartTime?: string | null
    scheduledEndTime?: string | null
  }
}> = ({ renting: { scheduledStartTime, scheduledEndTime } }) => {
  const tw = useTailwind()
  return (
    <AppText>
      {`${formatMonthDayNumbers(scheduledStartTime)} to ${formatMonthDayNumbers(
        scheduledEndTime,
      )}`}
    </AppText>
  )
}
