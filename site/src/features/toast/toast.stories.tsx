import type { Meta, StoryFn } from '@storybook/react'

import { Field, Formik } from 'formik'
import { Form } from '~/components/form'
import { Label } from '~/components/label'
import { PrimaryButton } from '~/components/primary_button'
import { Toast, type ToastProps, ToastProvider, useToast } from '.'

export const Playground: StoryFn<ToastProps> = () => {
  const toast = useToast(state => state.toast)
  const close = useToast(state => state.close)

  return (
    <>
      <Toast />
      <Formik
        initialValues={{ title: 'This is a toast message', duration: 3000 }}
        onSubmit={values => {
          toast({
            title: values.title,
            duration: values.duration
          })
        }}
      >
        {props => {
          return (
            <Form className={'flex flex-col items-start gap-5'}>
              <div className="flex flex-col">
                <Label htmlFor="title">Title:</Label>
                <Field
                  name="title"
                  id="date"
                  title={props.values.title}
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                />
              </div>

              <div className="flex flex-col">
                <Label htmlFor="duration">Duration milliseconds: </Label>
                <Field
                  name="duration"
                  type="number"
                  id="duration"
                  value={props.values.duration}
                  onBlur={props.handleBlur}
                  onChange={props.handleChange}
                />
              </div>

              <div className="flex gap-2">
                <PrimaryButton type="submit">Show toast</PrimaryButton>
                <PrimaryButton type="button" onClick={close}>
                  Close
                </PrimaryButton>
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default {
  component: Toast,
  argTypes: {
    handleOpenChange: {
      table: {
        disable: true
      }
    }
  },
  decorators: [
    Story => {
      return <ToastProvider>{Story()}</ToastProvider>
    }
  ]
} as Meta<ToastProps>
