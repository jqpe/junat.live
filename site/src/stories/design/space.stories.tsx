import { config, styled } from '@junat/design'

import { Story, Meta } from '@storybook/react'

import { Copyable } from '../__storybook__/components/copyable'

const space: Record<string, string> = config.theme.space

const Table = styled('table', {
  maxWidth: '550px'
})

const Row = styled('tr', {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: '5fr 5fr 1fr',
  alignItems: 'center',
  marginTop: '$xxs'
})

const SpaceTable = () => {
  return (
    <Table>
      <thead style={{ width: '100%' }}>
        <Row style={{ marginTop: 0 }}>
          <td>Preview</td>
          <td>CSS</td>
          <td>Value</td>
        </Row>
      </thead>
      <tbody>
        {Object.keys(space).map(key => {
          return (
            <Row key={key}>
              <td>
                <div
                  style={{
                    width: space[key],
                    height: '10px',
                    background: config.theme.colors.primary500
                  }}
                />
              </td>
              <td>
                <Copyable text={`var(${config.prefix}-space-${key})`} />
              </td>
              <td>{space[key]}</td>
            </Row>
          )
        })}
      </tbody>
    </Table>
  )
}

const story: Meta = {
  title: 'Design/Layout',
  component: SpaceTable
}

const Template: Story = () => {
  return <SpaceTable />
}

export const Space = Template.bind({})

export default story
