from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


@dataclass(frozen=True)
class Spec:
    filename: str
    size: tuple[int, int]
    title: str
    subtitle: str | None = None
    avatar: bool = False


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images"


def gradient(size: tuple[int, int], top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size, top)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / max(1, h - 1)
        r = int(top[0] + (bottom[0] - top[0]) * t)
        g = int(top[1] + (bottom[1] - top[1]) * t)
        b = int(top[2] + (bottom[2] - top[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img


def safe_font(size: int) -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype("arial.ttf", size=size)
    except Exception:
        return ImageFont.load_default()


def render(spec: Spec) -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    base = gradient(spec.size, (10, 37, 64), (26, 58, 82))
    draw = ImageDraw.Draw(base)

    accent = (255, 107, 53)
    border = (253, 184, 19)

    pad = 56
    draw.rounded_rectangle(
        [pad, pad, spec.size[0] - pad, spec.size[1] - pad],
        radius=28,
        outline=border,
        width=4,
    )

    title_font = safe_font(44 if max(spec.size) >= 1000 else 28)
    subtitle_font = safe_font(24 if max(spec.size) >= 1000 else 16)

    title = spec.title.strip()
    subtitle = (spec.subtitle or "").strip()

    text_x = pad + 26
    text_y = pad + 26

    draw.text((text_x, text_y), title, fill=accent, font=title_font)
    if subtitle:
        draw.text((text_x, text_y + 64), subtitle, fill=(245, 245, 245), font=subtitle_font)

    badge = "PLACEHOLDER"
    badge_font = safe_font(16)
    badge_w, badge_h = draw.textbbox((0, 0), badge, font=badge_font)[2:]
    bx = spec.size[0] - pad - badge_w - 32
    by = pad + 18
    draw.rounded_rectangle([bx, by, bx + badge_w + 24, by + badge_h + 18], radius=999, fill=(255, 138, 92))
    draw.text((bx + 12, by + 9), badge, fill=(10, 37, 64), font=badge_font)

    if spec.avatar:
        base = base.convert("RGBA")
        mask = Image.new("L", spec.size, 0)
        mdraw = ImageDraw.Draw(mask)
        mdraw.ellipse([0, 0, spec.size[0] - 1, spec.size[1] - 1], fill=255)
        base.putalpha(mask)
        out_path = OUT / spec.filename
        base.save(out_path, "WEBP", quality=86, method=6)
        return

    out_path = OUT / spec.filename
    base.save(out_path, "WEBP", quality=86, method=6)


def main() -> None:
    specs = [
        Spec(
            filename="hero-mockup.webp",
            size=(1400, 1000),
            title="Manual Solar Buy-Side",
            subtitle="Mockup 3D (placeholder)",
        ),
        Spec(
            filename="manual-open.webp",
            size=(1400, 1000),
            title="Manual aberto",
            subtitle="Página interna (placeholder)",
        ),
        Spec(
            filename="ebook-free.webp",
            size=(1400, 1000),
            title="Ebook Bônus",
            subtitle="Execução em 48h (placeholder)",
        ),
        Spec(
            filename="og-image.webp",
            size=(1200, 630),
            title="Manual Solar Buy-Side",
            subtitle="Imagem OG (placeholder)",
        ),
        Spec(
            filename="author-francis.webp",
            size=(700, 700),
            title="Francis",
            subtitle="Autor (placeholder)",
            avatar=True,
        ),
        Spec(
            filename="testimonial-rodrigo.webp",
            size=(600, 600),
            title="Rodrigo S.",
            subtitle="Depoimento (placeholder)",
            avatar=True,
        ),
        Spec(
            filename="testimonial-1.webp",
            size=(600, 600),
            title="Camila R.",
            subtitle="Depoimento (placeholder)",
            avatar=True,
        ),
        Spec(
            filename="testimonial-2.webp",
            size=(600, 600),
            title="Bruno A.",
            subtitle="Depoimento (placeholder)",
            avatar=True,
        ),
        Spec(
            filename="testimonial-3.webp",
            size=(600, 600),
            title="Patrícia M.",
            subtitle="Depoimento (placeholder)",
            avatar=True,
        ),
    ]

    for spec in specs:
        render(spec)

    print(f"Generated {len(specs)} placeholder images in: {OUT}")


if __name__ == "__main__":
    main()
