import type { Locale } from '~/types/common'

import { Formik } from 'formik'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import { PrimaryButton } from '~/components/primary_button'

import translate from '~/utils/translate'

import { getCalendarDate } from '~/utils/date'
import { handleAutoFocus } from '../helpers'

const Dialog = dynamic(() =>
  import('~/components/dialog').then(mod => mod.Dialog)
)

const Form = dynamic(() => import('~/components/form').then(mod => mod.Form))

const Field = dynamic(() => import('~/components/field').then(mod => mod.Field))

export type DatePickerProps = {
  onOpenChange: (open: boolean) => unknown
  handleChoice: (choice: string) => unknown

  locale: Locale
  departureDate: string
}

const schema = yup.object().shape({
  date: yup.date().default(() => new Date())
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
      title={t('chooseDate')}
      description={t('changeDepartureDate')}
      onOpenAutoFocus={handleAutoFocus}
    >
      <Formik
        initialValues={{
          date:
            props.departureDate === 'latest'
              ? getCalendarDate(`${new Date()}`)
              : props.departureDate
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
            <PrimaryButton type="submit">
              {t('buttons', 'submit')}
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
