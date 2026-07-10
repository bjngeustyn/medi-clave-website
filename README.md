# Medi-Clave Website

Static GitHub Pages-ready website for Medi-Clave.

## Local Preview

```powershell
npm run build
python -m http.server 4173 -d dist
```

Open `http://127.0.0.1:4173/`.

## Publishing

The repository includes `.github/workflows/pages.yml`. After pushing to GitHub, set Pages to use GitHub Actions if prompted. The workflow builds the static site into `dist` and deploys it to GitHub Pages.

## Product Admin

The product admin panel stores products in browser local storage so it can work on GitHub Pages without a server. Use **Export JSON** when products should be turned into permanent catalogue data.

Admin password formula:

```text
floor(((YYYYMMDD + current 24-hour hour) * 1999) / 1000)
```

Example at 2026-07-10 09:00 local browser time:

```text
floor(((20260710 + 9) * 1999) / 1000) = 40501177
```

For this static GitHub Pages version, the formula is stored in `app.js` and should be treated as a simple editing gate, not high-security authentication.

## Chatbot

The floating assistant uses `assets/medi-clave-chatbot.png` and provides selectable FAQ prompts for quotes, product fit, service, breakdowns, consumables, validation, installation, and WhatsApp handover.

## Laoken Video

The Laoken Low Temperature Plasma Steriliser product card uses `assets/laoken-low-temperature-plasma-steriliser.mov`.
