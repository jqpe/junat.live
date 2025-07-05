import type { HandlerOptions } from '../base/handler.js'
import type { TriggerPoint } from '../types/trigger_point.js'

import { createFetch } from '../base/create_fetch.js'

/** Used in combination with `traffic_info_messages` */
export const fetchTriggerPoints = async (opts: HandlerOptions = {}) => {
  const triggerPoints = await createFetch<TriggerPoint[]>(
    '/metadata/train-running-message-rules',
    opts,
  )

  return triggerPoints || []
}
