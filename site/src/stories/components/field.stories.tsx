import type { Meta, Story } from '@storybook/react'
import { Formik } from 'formik'

import type { FieldProps } from '~/components/elements/field'

import { Field } from '~/components/elements/field'

const story: Meta = {
  title: 'Form/Field',
  component: Field
}

const Template: Story<FieldProps> = args => {
  return (
    <Formik initialValues={{ name: 'name' }} onSubmit={console.log}>
      <Field {...args} />
    </Formik>
  )
}

export const Default = Template.bind({})
Default.args = {
  name: 'name'
}

export const Date = Template.bind({})
Date.args = {
  name: 'name',
  type: 'date'
}

export default story
