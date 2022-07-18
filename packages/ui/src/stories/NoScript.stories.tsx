import type { ComponentMeta } from '@storybook/react'

import { NoScript } from '../components/NoScript'

export default {
  component: NoScript
} as ComponentMeta<typeof NoScript>

const Template = (args: ComponentMeta<typeof NoScript>['args']) => {
  return (
    <NoScript
      as="div"
      translations={{
        en: 'Enable JavaScript in your browser settings.',
        sv: 'Aktivera JavaScript i din webbläsarinställningar.',
        fi: 'Laita JavaScript päälle selaimesi asetuksista.'
      }}
      {...args}
    />
  )
}

export const Default = Template.bind({})
