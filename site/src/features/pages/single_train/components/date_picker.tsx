import type { Locale } from '~/types/common'

import { Formik } from 'formik'
import dynamic from 'next/dynamic'

import * as yup from 'yup'

import Calendar from '~/components/icons/calendar.svg'

import { DialogButton, DialogProvider } from '~/components/elements/dialog'
import { PrimaryButton } from '~/components/buttons/primary'

import translate from '~/utils/translate'
import interpolateString from '~/utils/interpolate_string'

import { getFormattedDate, handleAutoFocus } from '../helpers'
import { getCalendarDate } from '~/utils/date'

const Dialog = dynamic(() =>
  import('@components/elements/dialog').then(mod => mod.Dialog)
)

const Form = dynamic(() =>
  import('@components/elements/form').then(mod => mod.Form)
)

const Field = dynamic(() =>
  import('@components/elements/field').then(mod => mod.Field)
)

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

  const formattedDate = getFormattedDate(
    props.departureDate,
    t('today'),
    props.locale
  )

  return (
    <DialogProvider open={props.open} onOpenChange={props.onOpenChange}>
      <DialogButton
        css={{
          gap: '10px',
          display: 'flex',
          alignItems: 'center',
          '& svg': { fill: '$slateGray700' },
          '&:hover svg': { fill: '$slateGray400' }
        }}
      >
        <Calendar />
        {interpolateString(t('$schedulesFor'), { date: formattedDate })}
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
            <Form css={{ display: 'flex', justifyContent: 'space-between' }}>
              <Field
                type="date"
                name="date"
                onBlur={props.handleBlur}
                onChange={props.handleChange}
                value={props.values.date}
              />
              <PrimaryButton
                size="xs"
                type="submit"
                css={{
                  '@dark': {
                    border: '1px solid $slateGray700'
                  }
                }}
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
