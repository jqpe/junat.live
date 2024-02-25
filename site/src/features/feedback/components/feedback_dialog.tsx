/* eslint-disable unicorn/no-thenable */
import { ANALYTICS_WEBSITE_ID } from '~/constants'

import { Dialog } from '~/components/dialog'
import { useAnalytics } from '~/hooks/use_analytics'
import { Formik } from 'formik'
import { Field } from '~/components/field'
import { PrimaryButton } from '~/components/primary_button'
import { Form } from '~/components/form'
import { useToast } from '~/features/toast'

import * as yup from 'yup'
import { Label } from '~/components/label'
import translate from '~/utils/translate'
import { useRouter } from 'next/router'
import { getLocale } from '~/utils/get_locale'
import React from 'react'

type Props = {
  /**
   * Where was this feedback triggered from? Can be a page, component...
   */
  feedbackEventFeature: string
  /**
   * Additional metadata that might be useful for tracking. E.g., if we are tracking signups: signup datetime.
   */
  feedbackEventData: Record<string, unknown> | null
  /**
   * Bring your own submission handler. Will not sent analytics event when this prop is specified (DYI if desired).
   */
  onSubmit?: (values: FeedbackSchema) => unknown
}

// Order matters, specify `setLocale` before defining the schema
// Note that strings specified here are used as keys for the actual translations
yup.setLocale({
  mixed: {
    required: 'empty'
  },
  string: {
    min: 'tooShort',
    max: 'tooLong'
  }
})

const feedbackSchema = yup.object().shape({
  body: yup.string().min(10).max(2000).required()
})

type FeedbackSchema = yup.InferType<typeof feedbackSchema>

export const FeedbackDialog = (props: Props) => {
  const analytics = useAnalytics()
  const initialValues = {
    body: ''
  } as FeedbackSchema
  const { toast } = useToast()
  const router = useRouter()
  const t = translate(getLocale(router.locale))

  return (
    <Dialog
      title={t('sendFeedback')}
      description={t('feedbackDialog', 'description')}
    >
      <Formik
        // Validating on blur causes issues when used inside a dialog (dialog close button requires two clicks)
        validateOnBlur={false}
        validationSchema={feedbackSchema}
        initialValues={initialValues}
        onSubmit={async values => {
          if (props.onSubmit) {
            props.onSubmit(values)
            return
          }

          if (!analytics) {
            toast('Failed to send feedback')
            return
          }

          analytics?.track(umamiMetadata => ({
            ...umamiMetadata,
            website: ANALYTICS_WEBSITE_ID,
            name: props.feedbackEventFeature,
            data: { ...props.feedbackEventData, ...values }
          }))
        }}
      >
        {props => {
          return (
            <Form onSubmit={props.handleSubmit} className="flex flex-col gap-2">
              <Label htmlFor="body">
                {t('feedback')} <span aria-hidden>*</span>
              </Label>
              <Field
                required
                component="textarea"
                id="body"
                name="body"
                placeholder={t('feedbackDialog', 'bodyPlaceholder')}
              />
              {props.errors.body && props.touched.body ? (
                <span className="text-error-600 dark:text-error-400 text-sm w-full">
                  {isImplementedErrorType(props.errors.body)
                    ? t('feedbackDialog', 'formErrors', props.errors.body)
                    : 'Unknown error'}
                </span>
              ) : null}

              <PrimaryButton
                type="submit"
                className="self-end"
                disabled={!props.isValid}
              >
                {t('buttons', 'submit')}
              </PrimaryButton>
            </Form>
          )
        }}
      </Formik>
    </Dialog>
  )
}

function isImplementedErrorType(
  error: string
): error is 'tooShort' | 'tooLong' | 'empty' {
  return ['tooShort', 'tooLong', 'empty'].includes(error)
}
