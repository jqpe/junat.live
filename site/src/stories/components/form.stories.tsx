import { Meta, Story } from '@storybook/react'

import { Form, FormProps } from '~/components/elements/form'
import { Formik } from 'formik'

const story: Meta = {
  title: 'Form/Form',
  component: Form
}

const Template: Story<FormProps> = args => {
  return (
    <Formik initialValues={{}} onSubmit={console.log}>
      <Form {...args} />
    </Formik>
  )
}

export const Default = Template.bind({})

export default story
