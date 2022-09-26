import { Story, Meta } from '@storybook/react'

import {
  primary,
  primaryA,
  secondary,
  secondaryA,
  slateGray,
  slateGrayA
} from '@junat/design/dist/colors'
import { styled } from '@junat/design'

const RowItem = styled('div', {
  fontSize: '12px',
  width: '100px',
  height: '100px'
})

type Key = string
type CssValue = string
type ColorCategory = string

const colors: Record<ColorCategory, Record<Key, CssValue>> = {
  Primary: primary,
  ['Primary Alpha']: primaryA,

  Secondary: secondary,
  ['Secondary Alpha']: secondaryA,

  ['Slate Gray']: slateGray,
  ['Slate Gray Alpha']: slateGrayA
}

const Colors = () => {
  return (
    <>
      {Object.keys(colors).map(color => {
        return (
          <section key={color}>
            <h5>{color}</h5>
            <div style={{ display: 'flex' }}>
              {Object.keys(colors[color]).map(key => {
                return (
                  <RowItem
                    title={colors[color][key]}
                    key={key}
                    css={{
                      background: colors[color][key]
                    }}
                  />
                )
              })}
            </div>
          </section>
        )
      })}
    </>
  )
}

const story: Meta = {
  title: 'Design/Colors',
  component: Colors
}

const Template: Story = () => {
  return <Colors />
}

export const all = Template.bind({})

export default story
