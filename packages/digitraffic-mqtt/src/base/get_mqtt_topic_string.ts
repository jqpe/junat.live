import type { SubscribeToTrainsOptions } from '../handlers/subscribe_to_trains'

/**
 * Append slash separated options ({@link SubscribeToTrainsOptions}) to `topicString` with each undefined property replaced by +
 *
 * If `options` is an empty object returns `topicString` followed by #
 *
 * @internal
 */
export const getMqttTopicString = (
  topicString: string,
  options: SubscribeToTrainsOptions
) => {
  const base: Record<keyof SubscribeToTrainsOptions, string> = {
    departureDate: '+',
    trainNumber: '+',
    trainCategory: '+',
    trainType: '+',
    operator: '+',
    commuterLine: '+',
    runningCurrently: '+',
    timetableType: '+'
  }

  if (Object.values(options).filter(opt => opt !== undefined).length === 0) {
    return `${topicString}#`
  }

  const merged = Object.assign(base, options)

  return `${topicString}` + Object.values(merged).join('/')
}
