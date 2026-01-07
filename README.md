# Solar Buy-Side Landing Page

Landing page estática (HTML/CSS/JS) para o produto **Manual Solar Buy-Side**.

## Como rodar

- Com Vite:
  - `npm install`
  - `npm run dev`

- Alternativa simples (sem build):
  - `python -m http.server 5173`
  - Acesse `http://localhost:5173/`

## O que ajustar antes de publicar

- Link de checkout: `index.html` (seção `#pricing`) atualmente usa `https://checkout.exemplo.com`.
- Meta tags: `index.html` (`canonical`, `og:url`, `og:image`).
- Preço/oferta: `index.html` (seção `#pricing`) e JSON-LD.
- Conteúdo (autor/depoimentos): personalize com dados reais.

## Estrutura

- `index.html`
- `css/` (variables/reset/typography/components/sections/animations)
- `js/` (scroll-animations/countdown/form-validation/main)
- `assets/patterns/` (SVGs)
- `assets/images/` (placeholders `.webp` gerados no setup)

## Build

- `npm run build`
- `npm run preview`
