"""Regenerate the 50 permanent Long/Short 20X templates from 25 clean backgrounds."""

from bitunix_card import CARD_TEMPLATES, DESIGN_COUNT, build_template_image, template_path


def main() -> None:
    CARD_TEMPLATES.mkdir(parents=True, exist_ok=True)
    for design in range(1, DESIGN_COUNT + 1):
        for direction in ("LONG", "SHORT"):
            image = build_template_image(design, direction)
            image.save(template_path(design, direction), format="JPEG", quality=94, optimize=True)
    print(f"Generadas {DESIGN_COUNT * 2} plantillas en {CARD_TEMPLATES}")


if __name__ == "__main__":
    main()
