import { describe, expect, it } from 'vitest'
import { getLocaleOrThrow } from '@utils/get_locale_or_throw'

import config from '../../next.config'

describe('get locale or throw', () => {
  it("doesn't throw for the languages listed in config", () => {
    expect(config.i18n?.locales).toBeDefined()

    for (const locale of config.i18n?.locales!) {
      expect(() => getLocaleOrThrow(locale)).not.toThrow()
    }
  })

  it('throws for an unsupported language', () => {
    expect(() => getLocaleOrThrow('not a locale')).toThrow()
  })
})
