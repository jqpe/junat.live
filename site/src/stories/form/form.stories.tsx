import { Meta, StoryObj } from '@storybook/react'
import { Form, FormProps } from '~/components/elements/form'

import { Formik } from 'formik'

import { Label } from '~/components/elements/label'
import { Field } from '~/components/elements/field'

export const Default: StoryObj<FormProps> = {}
export const Complete: StoryObj<FormProps> = {
  render: () => {
    return (
      <Formik
        initialValues={{ date: '2022-01-01', name: 'Pedro' }}
        onSubmit={console.log}
        validate={async () => ({ date: 'error' })}
      >
        {props => {
          return (
            <Form>
              <Label htmlFor="date">Date:</Label>
              <Field
                name="date"
                type="date"
                id="date"
                value={props.values.date}
                onBlur={props.handleBlur}
                onChange={props.handleChange}
              />

              <Label htmlFor="name">Name: </Label>
              <Field
                name="name"
                type="text"
                id="name"
                value={props.values.name}
                onBlur={props.handleBlur}
                onChange={props.handleChange}
              />

              {props.errors.name && (
                <div style={{ border: '1px solid red' }}>
                  {props.errors.name}
                </div>
              )}
              {props.errors.date && (
                <div style={{ border: '1px solid red' }}>
                  {props.errors.date}
                </div>
              )}

              <button type="submit">Submit</button>
            </Form>
          )
        }}
      </Formik>
    )
  }
}

const meta: Meta<typeof Form> = {
  component: Form,
  decorators: [
    Story => {
      return (
        <Formik initialValues={{}} onSubmit={console.log}>
          {Story}
        </Formik>
      )
    }
  ]
}

export default meta
