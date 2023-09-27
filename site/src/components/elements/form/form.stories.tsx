import { Meta, StoryFn } from '@storybook/react'
import { Form, FormProps } from './'

import { Formik } from 'formik'

import { Label } from '~/components/elements/label'
import { Field } from '~/components/elements/field'
import { PrimaryButton } from '~/components/buttons/primary'

export const Default: StoryFn<FormProps> = () => {
  return (
    <Formik
      initialValues={{ date: '2022-01-01', name: 'Pedro' }}
      onSubmit={console.log}
    >
      {props => {
        return (
          <Form
            css={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '$m'
            }}
          >
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

            <PrimaryButton size="xs" type="submit">
              Submit
            </PrimaryButton>
          </Form>
        )
      }}
    </Formik>
  )
}

const meta = {
  component: Form,
  parameters: {
    actions: {
      handles: ['onSubmit']
    }
  },
  argTypes: {
    css: {
      table: {
        disable: true
      }
    }
  }
} satisfies Meta<typeof Form>

export default meta
