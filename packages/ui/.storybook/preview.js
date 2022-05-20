import './reset.css'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
}

export const decorators = [
  Story => {
    return (
      <div style={{ maxWidth: '550px', margin: 'auto' }}>
        <Story />
      </div>
    )
  }
]
