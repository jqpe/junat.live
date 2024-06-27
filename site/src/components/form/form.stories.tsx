import type { Meta, StoryFn } from '@storybook/react'
import type { FormProps } from '.'

import { Formik } from 'formik'

import { Field } from '~/components/field'
import { Label } from '~/components/label'
import { PrimaryButton } from '~/components/primary_button'
import { Form } from '.'

export const Default: StoryFn<FormProps> = () => {
  return (
    <Formik
      initialValues={{ date: '2022-01-01', name: 'Pedro' }}
      onSubmit={console.log}
    >
      {props => {
        return (
          <Form className={'flex flex-col items-start gap-5'}>
            <div>
              <Label htmlFor="date">Date:</Label>
              <Field
                name="date"
                type="date"
                id="date"
                value={props.values.date}
                onBlur={props.handleBlur}
                onChange={props.handleChange}
              />
            </div>

            <div>
              <Label htmlFor="name">Name: </Label>
              <Field
                name="name"
                type="text"
                id="name"
                value={props.values.name}
                onBlur={props.handleBlur}
                onChange={props.handleChange}
              />
            </div>

            <PrimaryButton type="submit">Submit</PrimaryButton>
          </Form>
        )
      }}
    </Formik>
  )
}

const meta = {
  component: Form,
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta<typeof Form>

export default meta
