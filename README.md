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

Default admin password:

```text
MediClave2026!
```

For this static GitHub Pages version, the password is stored in `app.js` and should be treated as a simple editing gate, not high-security authentication.

## Chatbot

The floating assistant uses `assets/medi-clave-chatbot.png` and provides selectable FAQ prompts for quotes, product fit, service, breakdowns, consumables, validation, installation, and WhatsApp handover.

## LinkedIn Video

The Specialized Equipment product card links to this Medi-Clave LinkedIn technology post:

```text
https://www.linkedin.com/posts/medi-clave-pty-ltd_technology-innovation-autoclave-activity-6971066258922295296-v91U
```
