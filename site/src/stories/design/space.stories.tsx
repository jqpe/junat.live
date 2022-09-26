import { config, styled } from '@junat/design'

import { Story, Meta } from '@storybook/react'

const space: Record<string, string> = config.theme.space

const Table = styled('table', {
  maxWidth: '550px'
})

const Row = styled('tr', {
  display: 'grid',
  width: '100%',
  gridTemplateColumns: '150% 100%',
  alignItems: 'center',
  marginTop: '$1'
})

const SpaceTable = () => {
  return (
    <Table>
      <thead style={{ width: '100%' }}>
        <Row style={{ marginTop: 0 }}>
          <td>Preview</td>
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
