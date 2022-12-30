import type { StoryObj, Meta } from '@storybook/react'
import type { FieldProps } from '~/components/elements/field'

import { Formik } from 'formik'

import { Field } from '~/components/elements/field'

export const Default: StoryObj<FieldProps> = {}
export const Date: StoryObj<FieldProps> = { args: { type: 'date' } }

const meta: Meta<typeof Field> = {
  args: {
    name: 'name'
  },
  component: Field,
  decorators: [
    Story => {
      return (
        <Formik initialValues={{ name: 'name' }} onSubmit={console.log}>
          <Story />
        </Formik>
      )
    }
  ]
}

export default meta
