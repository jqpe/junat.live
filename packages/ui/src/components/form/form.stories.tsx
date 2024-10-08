import type { Meta, StoryFn } from '@storybook/react'
import type { FormProps } from './form'

import { Formik } from 'formik'

import { Button } from '../../components/button'
import { Field } from './field'
import { Form } from './form'
import { Label } from './label'

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

            <Button type="submit">Submit</Button>
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
