## Add a locale

1. Copy `en.json` as a starting point (or your native language)
2. Add the locale to `src/constants/locales.js`, it should be the filename `<locale>.json`, also modify the JSDOC type annotation and `ROUTES` object
3. Check if anything in `src/middleware.ts` needs to be updated as matcher values need to be static. 
4. From the directory root run `node scripts/clear_stale_cache.js`
5. Run `pnpm test 'locales'`.

> **Warning**
> Use [UTS Locale Identifiers](https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers) in the file name.
> The file name should be the same as the value used across the application.

## Interpolation

Strings that require interpolation are to be prefixed with `$`. The string must contain one or more keys wrapped by curly brackets:

```js
const obj = {
    "$greet": "Hello {{where}}"
}

interpolateString(obj.$greet, {where: "there"}) // -> Hello there
```