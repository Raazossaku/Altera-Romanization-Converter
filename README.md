# Altera Romanization Converter

A client-side web app for converting between romanization systems ("lects") used for the
Sinosphere states of Atlas Altera (Project Altera). It runs entirely in the browser.

Created by Raazossaku. The original Laoguoyin converter was written in full by
Raazossaku in Python, and the web app was developed from it with the help of Claude.

## Layout

| Folder | What it is |
| --- | --- |
| `app/` | The web app: Vite + TypeScript, tests with Vitest. |
| `app/public/data/` | Laoguoyin character and phrase data (GPL-3.0, see below). |

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
- Data in `app/public/data/`: GPL-3.0, derived from
  [baopaau/rime-bepemefeve](https://github.com/baopaau/rime-bepemefeve).
  See [`app/public/data/NOTICE.md`](app/public/data/NOTICE.md).
