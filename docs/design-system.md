# Design System — Manual Solar Buy-Side

## Paleta de cores

| Uso | Hex |
|---|---|
| Primária (Azul profundo) | `#0A2540` |
| Secundária (Laranja vibrante) | `#FF6B35` |
| Destaque (Amarelo dourado) | `#FDB813` |
| Branco | `#FFFFFF` |
| Cinza claro | `#F5F7FA` |
| Cinza médio | `#8B95A5` |
| Preto | `#1A1A1A` |

Implementação: variáveis CSS em `assets/css/styles.css`.

## Tipografia

- Headings: `Inter` (700–800+)
- Body: `Inter` (400–600)

Hierarquia (responsiva via `clamp()`):

- H1: `36px → 64px`
- H2: `30px → 44px`
- H3: `22px`
- Body: `16px`
- Small: `14px`

## Componentes

- Botões (`.btn` + variantes): hover com scale + shadow; active com scale 0.98.
- Cards (`.card`): borda sutil, `box-shadow` suave e elevação no hover.
- FAQ (`[data-accordion]`): ícone +/− animado + expansão suave.
- Scroll reveal (`.reveal`): fade in + slide up via `IntersectionObserver`.

## Acessibilidade

- Contraste: fundos escuros usam texto com opacidade alta; CTAs possuem foco visível.
- Imagens: `alt` definido; elementos decorativos usam `alt=""` + `aria-hidden="true"`.

