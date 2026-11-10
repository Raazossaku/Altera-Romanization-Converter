# Altera Romanization Converter

A client-side web app for converting between romanization systems ("lects") used for the
Sinosphere states of Atlas Altera (Project Altera). It runs entirely in the browser.

Live site: https://raazossaku.github.io/Altera-Romanization-Converter/

Created by Raazossaku. The original Laoguoyin converter was written in full by
Raazossaku in Python, and the web app was developed from it with the help of Claude.

## Layout

| Folder | What it is |
| --- | --- |
| `app/` | The web app: Vite + TypeScript, tests with Vitest. |
| `app/data/` | Source data for each lect, processed into JSON at build time. |
| `app/public/` | Static files published with the site, including the data licence and notice. |

## Develop

Requires Node.js (LTS).

```bash
cd app
npm install
npm run dev      # dev server with hot reload
npm test         # unit tests
npm run build    # type-check and build to app/dist
```

## Licences

- Application code: [MIT](LICENSE).
- Laoguoyin data in `app/data/laoguoyin/`: GPL-3.0, derived from
  [baopaau/rime-bepemefeve](https://github.com/baopaau/rime-bepemefeve).
- Korean data in `app/data/korean/`: BSD 3-clause, from
  [libhangul](https://github.com/libhangul/libhangul).
- Details and modifications: [`app/public/NOTICE.md`](app/public/NOTICE.md).
