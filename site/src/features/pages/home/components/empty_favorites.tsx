type Props = {
  heading: string
  body: string
}

export const EmptyFavorites = (props: Props) => {
  return (
    <div style={{ background: 'rgba(0,0,0,0.15)', padding: '5px' }}>
      <h4>{props.heading}</h4>
      <p>{props.body}</p>
    </div>
  )
}
