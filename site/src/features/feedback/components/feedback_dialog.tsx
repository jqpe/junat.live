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

const feedbackSchema = yup.object().shape({
  body: yup
    .string()
    .min(10, 'Too short')
    .max(2000, 'Too long')
    .required('Please enter a body'),
  includeScreenshot: yup.boolean(),
  replyEmail: yup.string().email('Please enter a valid email')
})

type FeedbackSchema = yup.InferType<typeof feedbackSchema>

export const FeedbackDialog = (props: Props) => {
  const analytics = useAnalytics()
  const initialValues = {
    body: '',
    includeScreenshot: true,
    replyEmail: ''
  } as FeedbackSchema
  const { toast } = useToast()

  return (
    <Dialog
      title="Send feedback"
      description="Thank you for helping build Junat.live! Your feedback helps us prioritize features and fixes."
    >
      <Formik
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
              <Field
                component="textarea"
                name="body"
                placeholder="Please describe in detail your issue or feature request."
              />
              {props.errors.body && props.touched.body ? (
                <span className="text-error-600 font-sm w-full">
                  {props.errors.body}
                </span>
              ) : null}

              <Label htmlFor="replyEmail">Email (optional)</Label>
              <Field name="replyEmail" type="email" id="replyEmail" />
              {props.errors.replyEmail && props.touched.replyEmail ? (
                <span className="text-error-600 font-sm w-full">
                  {props.errors.replyEmail}
                </span>
              ) : null}

              <Label>
                <Field name="includeScreenshot" type="checkbox" />
                {props.values.includeScreenshot
                  ? 'Include screenshot'
                  : 'Do not include a screenshot'}
              </Label>

              <PrimaryButton
                type="submit"
                className="self-end"
                disabled={!props.isValid}
              >
                submit
              </PrimaryButton>
            </Form>
          )
        }}
      </Formik>
    </Dialog>
  )
}
