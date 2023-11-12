import Link from 'next/link'
import React from 'react'

export const AboutUsPage = () => {
  const favoritesVideo = React.createRef<HTMLVideoElement>()

  React.useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <main className="flex flex-col max-w-[500px] m-auto p-2 mt-5">
      <div className="mx-5 mb-2">
        <h1>About Us</h1>
        <p className="mt-2">
          Junat.live was built as an alternative for proprietary train schedule
          websites. Our values are privacy, reliability, and accessibility.
          Junat.live is open-source software.
        </p>
        <h2 className="mt-4">Features</h2>
        <p className="mt-2">
          The core feature of Junat.live is accurate real-time departure
          predictions. All station- and train pages use this functionality. It
          just works. Below other features, use the web app to discover the
          rest.
        </p>
      </div>
      <Section id="favorites">
        <SectionHeading>Favorites</SectionHeading>
        <p>Save your frequntly used stations for easy access.</p>
        <video
          ref={favoritesVideo}
          src="/videos/favorites_feature.mp4"
          onClick={() => {
            favoritesVideo.current?.paused
              ? favoritesVideo.current.play()
              : favoritesVideo.current?.pause()
          }}
          muted
          autoPlay
          playsInline
          loop
          preload="true"
        />
        <ol className="text-sm list-disc">
          <li>Go to a station page</li>
          <li>
            Click the menu available on the page, the big button with three
            dots.
          </li>
          <li>
            Add a station to favorites from the submenu, it will be instantly
            available on homepage for later use.
          </li>
          <li>
            Toggle between favorites and all stations with the toggle button
            below search bar.
          </li>
        </ol>
      </Section>
      <Section id="geolocation">
        <SectionHeading>Geolocation</SectionHeading>
        <p>
          Get to the station closest to you with a click of a button. Your
          location is provided by your browser so accuracy may vary. If your
          advertised location is not accurate to 3km, we will just sort the
          stations by distance. Use GPS and/or Wi-Fi for best results. This
          functionality is only available on the homepage (the button on the
          bottom right)
        </p>
      </Section>
      <Section id="filtering">
        <SectionHeading>Filtering</SectionHeading>
        <p>
          Filter trains on the station page by destination. The feature is smart
          enough to also include trains that stop at that station, even if
          it&apos;s not the final destination.
        </p>
        <ol className="text-sm list-disc my-4">
          <li>Go to a station page</li>
          <li>
            Click the menu available on the page, the big button with three
            dots.
          </li>
          <li>
            Open the filter dialog from the submenu, type in the destination,
            and submit the form.
          </li>
        </ol>
        <p>
          When a filter is active, a purple dot will appear next to the menu
          button.
        </p>
      </Section>
      <div className="flex gap-2 mb-4">
        Ready when you are! <Link href="/">To home</Link>
      </div>
    </main>
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
