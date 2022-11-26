import type { Locale } from '@typings/common'

import { NextApiRequest, NextApiResponse } from 'next'

import initialWebmanifest from './site.webmanifest'

import { LOCALES } from '~/constants/locales'

const getLocalePath = (languageHeader?: string): Locale => {
  if (!languageHeader) {
    return 'en'
  }

  for (const locale of LOCALES) {
    if (new RegExp(locale).test(languageHeader)) {
      return locale
    }
  }

  return 'en'
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (!request.url) {
    response.status(400).end()
    return
  }

  const url = new URL(request.url, `http://${request.headers.host}`)

  const params = url.searchParams
  const webmanifest = { ...initialWebmanifest }

  const locale = getLocalePath(request.headers['accept-language'])

  if (params.has('startUrl')) {
    webmanifest.start_url = `/${locale}${params.get('startUrl')}`
  }

  if (params.has('name')) {
    webmanifest.name = params.get('name')
  }

  if (params.has('shortName')) {
    webmanifest.short_name = params.get('shortName')
  }

  if (params.has('id')) {
    webmanifest.id = params.get('id')
  }

  response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8')
  response.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

  response.status(200).send(webmanifest)
}
