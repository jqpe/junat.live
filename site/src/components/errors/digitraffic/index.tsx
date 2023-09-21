import type { UseQueryResult } from '@tanstack/react-query'
import type { SimplifiedTrain } from '@typings/simplified_train'
import type { ErrorType } from '~/lib/digitraffic'
import type { Locale } from '@typings/common'

import translate from '@utils/translate'

import {
  List,
  StyledButton,
  StyledDetails,
  StyledListItem,
  StyledPre,
  StyledSection
} from './styles'

type DigitrafficErrorProps = UseQueryResult<SimplifiedTrain[], ErrorType> & {
  locale: Locale
}

export const DigitrafficError = (props: DigitrafficErrorProps) => {
  const t = translate(props.locale)

  if (props.failureCount > 0 && !props.isError) {
    return <p>{t('errors', 'digitraffic', 'refetching')}</p>
  }

  if (props.isError) {
    return (
      <StyledSection>
        <p>
          {t('errors', 'digitraffic', 'requestError')}:{' '}
          {props.error.statusText ?? t('errors', 'unknown')}
        </p>
        {Boolean(props.error.body) && (
          <StyledDetails locale={props.locale}>
            <StyledPre>{props.error.body}</StyledPre>
          </StyledDetails>
        )}
        <h2>{t('errors', 'digitraffic', 'whatToDo')}</h2>
        <List>
          <StyledListItem>
            {t('errors', 'digitraffic', 'errorOrigin')}{' '}
            <a href="https://status.digitraffic.fi/">status.digitraffic.fi</a>
          </StyledListItem>
          <StyledListItem>
            {t('errors', 'digitraffic', 'waitOrRetry')}
          </StyledListItem>
          <StyledListItem>
            {t('errors', 'digitraffic', 'lastStraw')}{' '}
            <a href="https://vr.fi">vr.fi</a> {t('or')}{' '}
            <a href="https://hsl.fi">hsl.fi</a>.
          </StyledListItem>
        </List>
        <StyledButton onClick={() => props.refetch()}>
          {t('tryAgain')}
        </StyledButton>
      </StyledSection>
    )
  }
  return null
}
