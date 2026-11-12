# aqua-friends.github.io

Landing page for [AQUA](https://github.com/DestinE-Climate-DT/AQUA) and [AQUA-diagnostics](https://github.com/DestinE-Climate-DT/AQUA-diagnostics).

Built with [Astro](https://astro.build), [GSAP ScrollTrigger](https://gsap.com/scrolltrigger/) and [Lenis](https://lenis.darkroom.engineering/).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
```

## Structure

- `src/pages/index.astro`: page content and sections
- `src/styles/global.css`: design tokens and layout
- `src/scripts/motion.js`: scroll animations (respects `prefers-reduced-motion`)
- `public/figures/`: diagnostic figures (from the AQUA-diagnostics docs)
- `public/figures/paper/`: schematics from Nurisso et al. (2026), GMD 19, 7725–7740, CC BY 4.0

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.
Enable it once in the repo: Settings → Pages → Source: **GitHub Actions**.
