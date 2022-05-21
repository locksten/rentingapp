import {
  addDays,
  differenceInDays,
  eachDayOfInterval,
  formatISO,
  isWithinInterval,
  subDays,
} from "date-fns"
import { useState, VFC } from "react"
import { View } from "react-native"
import { CalendarList } from "react-native-calendars"
import { useTailwind } from "tailwind-rn/dist"

export const CalendarRangeSelect: VFC<{
  start?: Date
  end?: Date
  disabledDates?: string[] | null
  onChange: (start?: Date, end?: Date) => void
}> = ({ start, end, disabledDates, onChange }) => {
  const tw = useTailwind()

  const selected = {
    textColor: tw("text-white").color as string,
    color: tw("text-primary-400").color as string,
    selected: true,
  }

  const daysBetween =
    start &&
    end &&
    (differenceInDays(end, start) > 1 || undefined) &&
    eachDayOfInterval({
      start: addDays(start?.getTime(), 1),
      end: subDays(end?.getTime(), 1),
    }).map((d) => formatISO(d, { representation: "date" }))

  const markedDaysBetween = daysBetween?.reduce(
    (obj, d) => ({ ...obj, [d]: selected }),
    {},
  )

  const disabledDays = disabledDates?.reduce(
    (obj, d) => ({ ...obj, [d]: { disabled: true } }),
    {},
  )

  const surroundsDisabled = (start?: Date, end?: Date) =>
    start &&
    end &&
    !!disabledDates?.find((d) => isWithinInterval(new Date(d), { start, end }))

  const update = (start?: Date, end?: Date) => {
    !(
      start &&
      disabledDates?.includes(formatISO(start, { representation: "date" }))
    ) &&
      !(
        end &&
        disabledDates?.includes(formatISO(end, { representation: "date" }))
      ) &&
      !surroundsDisabled(start, end) &&
      onChange(start, end)
  }

  return (
    <View style={tw("flex-1")}>
      <CalendarList
        firstDay={1}
        onDayPress={({ timestamp }) => {
          if (timestamp === start?.getTime()) {
            update(undefined, end)
          } else if (timestamp === end?.getTime()) {
            update(start, undefined)
          } else if (!start) {
            if (end && timestamp > end.getTime()) {
              update(end, new Date(timestamp))
            } else {
              update(new Date(timestamp), end)
            }
          } else if (!end) {
            if (start && timestamp < start.getTime()) {
              update(new Date(timestamp), start)
            } else {
              update(start, new Date(timestamp))
            }
          } else {
            if (
              Math.abs(timestamp - start.getTime()) <
              Math.abs(timestamp - end.getTime())
            ) {
              update(new Date(timestamp), end)
            } else {
              update(start, new Date(timestamp))
            }
          }
        }}
        minDate={new Date().toISOString()}
        markedDates={{
          ...disabledDays,
          ...markedDaysBetween,
          ...(start && {
            [formatISO(start, { representation: "date" })]: {
              ...selected,
              startingDay: true,
              endingDay: !end,
            },
          }),
          ...(end && {
            [formatISO(end, { representation: "date" })]: {
              ...selected,
              startingDay: !start,
              endingDay: true,
            },
          }),
        }}
        horizontal={true}
        pagingEnabled={true}
        markingType={"period"}
      />
    </View>
  )
}

export const useCalendarRangeSelect = () => {
  const [start, setStart] = useState<Date | undefined>(undefined)
  const [end, setEnd] = useState<Date | undefined>(undefined)

  const rangeSelectCalendarProps: Parameters<typeof CalendarRangeSelect>[0] = {
    start,
    end,
    onChange: (start, end) => {
      setStart(start)
      setEnd(end)
    },
  }

  return {
    rangeSelectCalendarProps,
    start: start ?? end,
    end: end ?? start,
    durationDays:
      (start && end && 1 + differenceInDays(end, start)) ??
      (start || end ? 1 : undefined),
  }
}
