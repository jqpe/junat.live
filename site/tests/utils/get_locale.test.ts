import { describe, expect, it } from 'vitest'
import { getLocale } from '@utils/get_locale'

import config from '../../next.config'

describe('get locale or throw', () => {
  it("doesn't throw for the languages listed in config", () => {
    expect(config.i18n?.locales).toBeDefined()

    for (const locale of config.i18n?.locales!) {
      expect(() => getLocale(locale)).not.toThrow()
    }
  })

  it('throws for an unsupported language', () => {
    expect(() => getLocale('not a locale')).toThrow()
  })
})
