import type { Locale } from '~/types/common'

import { Formik } from 'formik'
import * as yup from 'yup'

import { getCalendarDate } from '@junat/core/utils/date'
import { Button } from '@junat/ui/components/button'
import Close from '@junat/ui/icons/close.svg?react'

import { translate } from '~/i18n'
import { handleAutoFocus } from '../helpers'

const { Dialog } = await import('@junat/ui/components/dialog')
const { Form } = await import('@junat/ui/components/form')
const { Field } = await import('@junat/ui/components/form/field')

export type DatePickerProps = {
  onOpenChange: (open: boolean) => unknown
  handleChoice: (choice: string) => unknown

  locale: Locale
  departureDate: string
}

const schema = yup.object().shape({
  date: yup.date().default(() => new Date()),
})

export function DatePickerDialog(props: DatePickerProps) {
  const t = translate(props.locale)

  const date = new Date()
  const minimumDate = getCalendarDate(date.toISOString())
  const maximumDate = () => {
    date.setDate(date.getDate() + 31)

    return getCalendarDate(date.toISOString())
  }

  return (
    <Dialog
      Close={Close}
      t={t}
      title={t('chooseDate')}
      description={t('changeDepartureDate')}
      onOpenAutoFocus={handleAutoFocus}
    >
      <Formik
        initialValues={{
          date:
            props.departureDate === 'latest'
              ? getCalendarDate(`${new Date()}`)
              : props.departureDate,
        }}
        validationSchema={schema}
        onSubmit={values => {
          props.handleChoice(values.date)
          props.onOpenChange(false)
        }}
      >
        {props => (
          <Form className="flex justify-between">
            <Field
              type="date"
              name="date"
              min={minimumDate}
              max={maximumDate()}
              onBlur={props.handleBlur}
              onChange={props.handleChange}
              value={props.values.date}
            />
            <Button type="submit">{t('buttons.submit')}</Button>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
