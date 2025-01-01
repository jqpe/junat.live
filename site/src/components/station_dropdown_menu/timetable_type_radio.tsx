import type { RadioGroupItemProps } from '@radix-ui/react-radio-group'

import React from 'react'
import { Indicator, Item as RadioItem, Root } from '@radix-ui/react-radio-group'
import { cx } from 'cva'
import { From, To } from 'frominto'

import { useTimetableType } from '@junat/react-hooks/use_timetable_type'

import { translate, useLocale } from '~/i18n'

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
  const locale = useLocale()

  const [timetableType] = useTimetableType(state => [state.type])
  const t = translate(locale)

  const Label = ({
    htmlFor,
    reversed,
  }: {
    htmlFor: string
    reversed?: boolean
  }) => {
    let [current, target] = [props.currentStation, props.targetStation]
    if (reversed) [current, target] = [target, current]

    return (
      <label
        aria-label={
          locale === 'fi' ? `${From(current)} ${To(target)}` : undefined
        }
        htmlFor={htmlFor}
        className="pl-[15px] text-sm leading-none"
      >
        {current} <span aria-hidden>{'-->'}</span>{' '}  
        <span className="sr-only">{t('to')}</span> {target}
      </label>
    )
  }

  return (
    <Root
      defaultValue={timetableType}
      id={props.id}
      onValueChange={props.onValueChange}
      className="mt-1 flex flex-col gap-2"
    >
      <div className="flex items-center">
        <Item value="DEPARTURE" id={departureRadioId} />
        <Label htmlFor={departureRadioId} />
      </div>

      <div className="flex items-center">
        <Item value="ARRIVAL" id={arrivalRadioId} />
        <Label htmlFor={arrivalRadioId} reversed />
      </div>
    </Root>
  )
}
const Item = (props: RadioGroupItemProps) => {
  return (
    <RadioItem
      className={cx(
        'h-[16px] w-[16px] cursor-default rounded-full border-[1px] border-gray-300',
        'bg-white focus-visible:border-gray-600 focus-visible:outline-none',
        'dark:border-gray-700 dark:bg-transparent dark:focus-visible:border-gray-500',
      )}
      {...props}
    >
      <Indicator
        className={cx(
          'relative flex h-full w-full items-center justify-center after:block',
          "after:h-2 after:w-2 after:rounded-[50%] after:bg-primary-500 after:content-['']",
        )}
      />
    </RadioItem>
  )
}
