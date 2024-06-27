import type { Meta, StoryObj } from '@storybook/react'
import type { FieldProps } from './'

import { Formik } from 'formik'

import { Field } from './'

export const Default: StoryObj<FieldProps> = {}
export const Date: StoryObj<FieldProps> = { args: { type: 'date' } }

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
