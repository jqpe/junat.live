import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { Head } from '~/components/head'
import { getLocale } from '~/utils/get_locale'

import translate from '~/utils/translate'

export const AboutUsPage = () => {
  const router = useRouter()

  const locale = getLocale(router.locale)
  const t = translate(locale)

  React.useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <>
      <Head
        path="/about"
        description={t("aboutPage", "metadescription")}
        title={t("aboutPage", "topLevelHeading")}
      />
      <main className="flex flex-col max-w-[500px] m-auto p-2 mt-5">
        <div className="mx-5 mb-2">
          <h1>{t('aboutPage', 'topLevelHeading')}</h1>
          <p className="mt-2">{t('aboutPage', 'description')}</p>
          <h2 className="mt-4">{t('features')}</h2>
          <p className="mt-2">{t('aboutPage', 'highLevelFeatures')}</p>
        </div>

        <Section id="favorites">
          <SectionHeading>
            {t('aboutPage', 'favorites', 'heading')}
          </SectionHeading>
          <p>{t('aboutPage', 'favorites', 'description')}</p>
          <Video src="/videos/favorites.mp4" />
          <ol className="text-sm list-disc">
            {t('aboutPage', 'favorites', 'steps').map((step: string) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </Section>

        <Section id="geolocation">
          <SectionHeading>
            {t('aboutPage', 'geolocation', 'heading')}
          </SectionHeading>
          <p>{t('aboutPage', 'geolocation', 'description')}</p>
          <Video src="/videos/geolocation.mp4 " />
        </Section>

        <Section id="filtering">
          <SectionHeading>
            {t('aboutPage', 'filters', 'heading')}
          </SectionHeading>
          <p>{t('aboutPage', 'filters', 'description')}</p>
          <Video src="/videos/filters.mp4" />
          <ol className="text-sm list-disc my-4">
            {t('aboutPage', 'filters', 'steps').map((step: string) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>{t('aboutPage', 'filters', 'postscript')}</p>
        </Section>

        <div className="flex gap-2 mb-4">
          {t('readyWhenYouAre')} <Link href="/">{t('toHome')}</Link>
        </div>
      </main>
    </>
  )
}

const SectionHeading = (props: React.PropsWithChildren) => {
  return <h2 className="text-xl text-primary-500">{props.children}</h2>
}

const Section = (props: React.PropsWithChildren<{ id: string }>) => {
  return (
    <section id={props.id} className="p-5 my-2">
      {props.children}
    </section>
  )
}

const Video = (props: React.PropsWithoutRef<{ src: string }>) => {
  const video = React.createRef<HTMLVideoElement>()
  const togglePlay = () => {
    video.current?.paused ? video.current.play() : video.current?.pause()
  }

  return (
    <video
      ref={video}
      src={props.src}
      onClick={togglePlay}
      muted
      autoPlay
      playsInline
      loop
      preload="metadata"
    />
  )
}
