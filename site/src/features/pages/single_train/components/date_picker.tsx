import type { Locale } from '~/types/common'

import { Formik } from 'formik'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import Calendar from '~/components/icons/calendar.svg'

import { DialogButton, DialogProvider } from '~/components/dialog'
import { PrimaryButton } from '~/components/primary_button'

import interpolateString from '~/utils/interpolate_string'
import translate from '~/utils/translate'

import { getCalendarDate } from '~/utils/date'
import { getLocalizedDate, handleAutoFocus } from '../helpers'

const Dialog = dynamic(() =>
  import('@components/dialog').then(mod => mod.Dialog)
)

const Form = dynamic(() => import('~/components/form').then(mod => mod.Form))

const Field = dynamic(() => import('~/components/field').then(mod => mod.Field))

export type DatePickerProps = {
  onOpenChange: (open: boolean) => unknown
  handleChoice: (choice: string) => unknown

  open: boolean
  locale: Locale
  departureDate: string
}

const schema = yup.object().shape({
  date: yup.date().default(() => new Date())
})

export function DatePicker(props: DatePickerProps) {
  const t = translate(props.locale)

  const localizedDate = getLocalizedDate(
    props.departureDate,
    t('today'),
    props.locale
  )

  const date = new Date()
  const minimumDate = getCalendarDate(date.toISOString())
  const maximumDate = () => {
    date.setDate(date.getDate() + 31)

    return getCalendarDate(date.toISOString())
  }

  return (
    <DialogProvider open={props.open} onOpenChange={props.onOpenChange}>
      <DialogButton className="group gap-2 flex items-center [border:2px_solid_transparent] dark:hover:bg-secondaryA-500 focus:border-secondary-500">
        <Calendar className="group-hover:fill-secondary-500 fill-gray-500" />
        {interpolateString(t('$schedulesFor'), { date: localizedDate })}
      </DialogButton>
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
          onSubmit={async values => {
            if (values.date) {
              props.handleChoice(values.date)
              props.onOpenChange(false)
            }
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
              <PrimaryButton
                type="submit"
                className="dark:[border:1px_solid_theme(colors.gray.700)] "
              >
                {t('buttons', 'submit')}
              </PrimaryButton>
            </Form>
          )}
        </Formik>
      </Dialog>
    </DialogProvider>
  )
}
