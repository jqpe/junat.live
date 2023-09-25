import { StyledNotification } from './styles'

type Props = {
  title: string
  body: string
}

export const Notification = (props: Props) => {
  return (
    <StyledNotification initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h4>{props.title}</h4>
      <p> {props.body}</p>
    </StyledNotification>
  )
}
