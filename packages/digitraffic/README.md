<h1> Digitraffic <img src="https://junat.live/maskable_icon.png" align="right" width="38px"> </h1>

Utilities for working with [digitraffi.fi](https://digitraffic.fi) RESTful APIs.

## Configuration

- For Node versions >= 17.x you can use `node --experimental-fetch`
- Otherwise, include `fetch` in the globl object, see `src/polyfills/fetch_polyfill.ts` for an example.
  - Some frameworks polyfill fetch automatically (e.g. Next.js)
- `structuredClone` is polyfilled automatically, or uses native implementation on Node versions >= 17.0.0
