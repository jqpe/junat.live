# [Junat.live](https://junat.live)

See Finnish train schedules in real-time. The site uses an MQTT connection to keep the data fresh and updates in a matter of milliseconds.

<table>
<tbody><tr>
<td>
<img src="phone1.png" alt="A phone mockup with Ainola route in junat.live" />
</td>

<td>
<img src="phone2.png" alt="A phone mockup in a dark mode with Ainola route in junat.live"/>
</td>
</tr></tbody>
</table>

<sub>Mockups created with [deviceframes.com](https://deviceframes.com)<sub>

## Architecture

Yarn Workspaces is used to keep internal packages in sync. Each of the packages have their own suite of automated tests that can be
ran from the root or the package.

The backend currently consists of a headless CMS (Directus) that is used to localize the site for Finnish, English and Swedish.  
There are plans to intoduce an authetication system so that users may login and save their favorite stations for easy access.

The repo consists of three main packages:

- ### packages/site

  The site, built on Next.js and deployed to Oracle Cloud.

- ### packages/digitraffic

  A minimal wrapper for [Digitraffic](https://digitraffic.fi)'s REST endpoints. Also provides some extra features such as localized stations for Finnish, English and Swedish.

- ### digitraffic-mqtt
  Utilities for working with Digitraffic's MQTT APIs. For example, you can listen to trains just by initiating the client and asynchoronously loop over any updates:

```js
for await (train of client.trains) {
  console.log(`Train updated: ${train.trainNumber}.`)
}
```
