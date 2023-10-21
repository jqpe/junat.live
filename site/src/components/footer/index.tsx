import type { NextRouter } from 'next/router'

import dynamic from 'next/dynamic'

import React from 'react'

import { getLocale } from '@utils/get_locale'
import translate from '@utils/translate'

import { FINTRAFFIC } from '@constants'

import { getFintrafficPath } from './helpers'

const LanguageSelect = dynamic(
  () => import('@components/input/language_select')
)

const Anchor = (
  props: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>
) => (
  <a
    className="focus:text-primary-200 hover:text-primary-200 text-primary-500"
    {...props}
    target="_blank"
    rel="noreferrer"
  >
    {props.children}
  </a>
)

type Stations = Parameters<
  typeof import('~/components/input/language_select')['LanguageSelect']
>[0]['stations']

type AppFooterProps = {
  stations: Stations
  router: NextRouter
}

export function AppFooter(props: AppFooterProps) {
  const locale = getLocale(props.router.locale)
  const t = translate(locale)
  const path = getFintrafficPath(locale)

  return (
    <footer
      className={`mt-[3rem] p-[1rem_5vw] flex flex-col gap-5 right-0 left-0 bg-gray-700 text-gray-500
      bg-[position:0_0,0_10px,10px_-10px,-10px_0px,-10px_0,10px_12px] bg-[size:15px_5px] 
      `}
      style={{
        backgroundImage: backgroundImage()
      }}
    >
      <section>
        <LanguageSelect router={props.router} stations={props.stations} />
      </section>
      <section>
        <small className="text-sm">
          {`${t('trafficDataSource')} `}
          <Anchor href={`${FINTRAFFIC.URL}${path}`}>Fintraffic</Anchor>
          {` ${t('license')} `}
          <Anchor href={`${FINTRAFFIC.LICENSE_URL}${locale}`}>
            {FINTRAFFIC.LICENSE}
          </Anchor>
        </small>
      </section>
    </footer>
  )
}

function backgroundImage(): string {
  const H /**IGH_CONTRAST */ = '#030304' as const
  const A /**CCENT */ = '#252a35' as const
  const T /**RANPARENT */ = 'transparent' as const

  const D = 45 as const

  const matrix = [
    [D, H, '25%', T, '20%'],
    [-D, H, '25%', T, '25%'],
    [D, T, '75%', H, '25%'],
    [-D, T, '75%', H, '25%'],
    [-D, T, '', A, '25%'],
    [-D, T, '', H, '25%']
  ] as const

  return matrix
    .map(row => {
      const [d, color, colorPos, color2, colorPos2] = row
      return `linear-gradient(${d}deg, ${color} ${colorPos}, ${color2} ${colorPos2})`
    })
    .join(',')
}
