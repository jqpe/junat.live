import {
  Indicator,
  Item as RadioItem,
  Root,
  type RadioGroupItemProps
} from '@radix-ui/react-radio-group'
import React from 'react'

import { useTimetableType } from '~/hooks/use_timetable_type'

export const TimetableTypeRadio = (props: {
  /**
   * Localized string for the label.
   */
  currentStation: string
  /**
   * Localized string for the label.
   */
  targetStation: string
  id: string
  onValueChange: (value: 'DEPARTURE' | 'ARRIVAL') => void
}) => {
  const departureRadioId = React.useId()
  const arrivalRadioId = React.useId()

  const [timetableType] = useTimetableType(state => [state.type])

  return (
    <Root
      defaultValue={timetableType}
      id={props.id}
      onValueChange={props.onValueChange}
      className="flex flex-col gap-2 mt-1"
    >
      <div className="flex items-center">
        <Item value="DEPARTURE" id={departureRadioId} />
        <label
          htmlFor={departureRadioId}
          className="text-sm leading-none pl-[15px]"
        >
          {`${props.currentStation} --> ${props.targetStation}`}
        </label>
      </div>

      <div className="flex items-center">
        <Item value="ARRIVAL" id={arrivalRadioId} />
        <label
          htmlFor={arrivalRadioId}
          className="text-sm leading-none pl-[15px]"
        >
          {`${props.targetStation} --> ${props.currentStation}`}
        </label>
      </div>
    </Root>
  )
}

const Item = (props: RadioGroupItemProps) => {
  return (
    <RadioItem
      className="bg-white dark:bg-transparent w-[16px] h-[16px] rounded-full focus-visible:outline-none dark:focus-visible:border-gray-500 focus-visible:border-gray-600 cursor-default border-[1px] border-gray-300 dark:border-gray-700"
      {...props}
    >
      <Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[8px] after:h-[8px] after:rounded-[50%] after:bg-primary-500" />
    </RadioItem>
  )
}
