const constants = {
  SITE_NAME: 'Junat.live',
  SITE_URL: 'junat.live',
  LICENSE: {
    fi: `\
    Liikennetietojen lähde <a href="https://www.fintraffic.fi/fi" target="_blank">Fintraffic</a>,\
    lisenssi <a href="https://creativecommons.org/licenses/by/4.0/deed.fi" target="_blank">CC 4.0 BY</a>`,
    en: `\
    Traffic data source <a href="https://www.fintraffic.fi/en" target="_blank">Fintraffic</a>,\
    license <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC 4.0 BY</a>`,
    sv: `\
    Trafikdatakälla <a href="https://www.fintraffic.fi/sv" target="_blank">Fintraffic</a>,\
    licens <a href="https://creativecommons.org/licenses/by/4.0/deed.sv" target="_blank">CC 4.0 BY</a>`
  },
  NO_SCRIPT: {
    fi: 'Laita JavaScript päälle selaimesi asetuksista.',
    en: 'Enable JavaScript in your browser settings.',
    sv: 'Aktivera JavaScript i din webbläsarinställningar.'
  }
} as const

export default constants
