# Altera Romanization Converter

A client-side web app that romanizes text in the lects of Atlas Altera.

Created by Raazossaku. The original Laoguoyin converter was written in full by
Raazossaku in Python, and the web app was developed from it with the help of Claude.

Live site: https://raazossaku.github.io/Altera-Romanization-Converter/

## Layout

| Folder | What it is |
| --- | --- |
| `app/` | The web app: Vite + TypeScript, tests with Vitest. |
| `app/src/core/` | Lexicon, data loading and display settings. |
| `app/src/ui/` | Page layout, panels, etc. |
| `app/src/lects/` | Romanization rules and data build for each lect. |
| `app/scripts/` | Conversion of `app/data/` into the JSON files the app loads. |
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
