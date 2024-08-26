import type { Meta, StoryObj } from '@storybook/react'
import type { FieldProps } from './field'

import { Formik } from 'formik'

import { Field } from './field'

export const Default: StoryObj<FieldProps> = {}
export const DateField: StoryObj<FieldProps> = { args: { type: 'date' } }

const meta: Meta<typeof Field> = {
  args: {
    name: 'name',
  },
  component: Field,
  decorators: [
    Story => {
      return (
        <Formik initialValues={{ name: 'name' }} onSubmit={console.log}>
          <Story />
        </Formik>
      )
    },
  ],
}

export default meta
