import React from 'react'
import dynamic from 'next/dynamic'
import { cx } from 'cva'

import { FINTRAFFIC } from '@junat/core/constants'

import { useLocale, useTranslations } from '~/i18n'
import { getFintrafficPath } from './helpers'

const LanguageSelect = dynamic(() => import('~/components/language_select'))

const Anchor = (
  props: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>,
) => (
  <a
    className="text-primary-500 hover:text-primary-200 focus-visible:text-primary-200"
    {...props}
    target="_blank"
    rel="noreferrer"
  >
    {props.children}
  </a>
)

type Stations = Parameters<
  (typeof import('~/components/language_select'))['LanguageSelect']
>[0]['stations']

type AppFooterProps = {
  stations: Stations
}

export function AppFooter(props: Readonly<AppFooterProps>) {
  const locale = useLocale()
  const t = useTranslations()
  const path = getFintrafficPath(locale)

  return (
    <footer
      className={cx(
        'left-0 right-0 mt-[3rem] flex flex-col gap-5 bg-gray-700 bg-[size:15px_5px] text-gray-500',
        'bg-[position:0_0,0_10px,10px_-10px,-10px_0px,-10px_0,10px_12px] p-[1rem_5vw]',
      )}
      style={{
        backgroundImage: backgroundImage(),
      }}
    >
      <section>
        <LanguageSelect stations={props.stations} />
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
    [-D, T, '', H, '25%'],
  ] as const

  return matrix
    .map(row => {
      const [d, color, colorPos, color2, colorPos2] = row
      return `linear-gradient(${d}deg, ${color} ${colorPos}, ${color2} ${colorPos2})`
    })
    .join(',')
}
