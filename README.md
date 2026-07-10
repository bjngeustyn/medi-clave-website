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
