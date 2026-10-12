# JN-W01 — Royal Myanmar Love Chronicle | Section 04

Brand: JackNex Studio  |  Project: Myanmar Heritage Essential

## Production notes
17 independent, exact-dimension PNGs. Only the 2 parchment backgrounds are opaque.
All ornamental overlays have RGBA alpha; portraits and editable text must be inserted in the website, never baked into PNG.
All 17 images are derived from the supplied royal Myanmar art direction, using hand-composed decorative image artwork and new drawn ornament/botanical layers.
The designs are Myanmar-inspired rather than replicas of a specific documented historical craft pattern.
Do not distort frames: scale proportionally and layer photos underneath; set pointer-events:none on decor.
Performance: serve modern WebP/AVIF derivatives on site when appropriate, lazily load below-the-fold art; preserve originals here.
Accessibility: respect prefers-reduced-motion; actual content needs accessible HTML, not image text.

## Palette

| Token | Value |
|---|---|
| Warm ivory | `#F8F0E4` |
| Antique parchment | `#EADAC1` |
| Champagne gold | `#D7B77B` |
| Rich antique gold | `#B68B4D` |
| Deep ornamental gold | `#946B36` |
| Royal burgundy | `#71383C` |
| Warm manuscript brown | `#795448` |
| Sunlight | `#F5D9A0` |

## Image inventory and animation guidance

| File | Pixels | Alpha | Placement | GSAP usage |
|---|---|---|---|---|
| `01-background/01-royal-manuscript-background-mobile.png` | 2048×3072 | Opaque | Mobile section canvas; center 65% kept quiet | Fixed background with very slow parallax ≤ 12 px |
| `01-background/01-royal-manuscript-background-desktop.png` | 2560×1440 | Opaque | Independent wide desktop composition | Background cover; do not stretch mobile file |
| `02-atmosphere/02-royal-entrance-mist.png` | 2048×1200 | RGBA | Section 3 → 4 translucent haze and pagoda echoes | Move upward 0–40 px and opacity 0→1→0 |
| `03-heading/03-royal-heading-ornament.png` | 1600×700 | RGBA | Above editable HTML heading | opacity 0→1, translateY(20px→0) |
| `04-chapter-frames/04-royal-chapter-frame.png` | 1500×1900 | RGBA | Chapter hero arch; place photographs behind transparent opening | scale(.96→1), gentle reveal |
| `05-photo-frames/05-royal-photo-frame.png` | 1600×1800 | RGBA | Gold border; exact 4:5 central image opening | Original couple photo beneath, object-fit:cover |
| `06-timeline/06-golden-timeline-ornament.png` | 450×2400 | RGBA | Continuous narrow timeline alongside chapters | Reveal with mask or clip-path downward |
| `07-chapter-badge/07-royal-chapter-badge.png` | 1100×650 | RGBA | Reusable burgundy chapter plaque; overlay editable HTML text | Fade slightly before each chapter title |
| `08-typography/08-royal-typography-reference.png` | 1600×1000 | RGBA | VISUAL REFERENCE ONLY—never replace semantic HTML text | Recreate with CSS/HTML; not displayed on live site |
| `09-decorations/09a-royal-lotus-central.png` | 1200×1200 | RGBA | Central ceremonial ornament | Subtle fade/scale only |
| `09-decorations/09b-royal-floral-left.png` | 1200×1500 | RGBA | Gilded lower-left chapter embellishment | Parallax 8–20 px |
| `09-decorations/09c-royal-floral-right.png` | 1200×1500 | RGBA | Matching separately drawn right embellishment | Parallax 8–20 px opposite direction |
| `10-transition/10-royal-closing-transition.png` | 1800×950 | RGBA | Bottom of Section 4 before Royal Blessing section | Reveal widthwise as last photograph dissolves |
| `11-parallax/11a-floral-parallax-left.png` | 1400×1600 | RGBA | Soft ivory-blush flowers from lower left | slow y translation, 15–25 px maximum |
| `11-parallax/11b-floral-parallax-right.png` | 1400×1600 | RGBA | Independently composed soft flowers on right | subtle different y translation |
| `12-particles/12a-cinematic-gold-particles.png` | 2048×2048 | RGBA | Sparse glowing dust overlay on final memory | opacity animation; avoid high-frequency continuous motion |
| `12-particles/12b-floating-royal-petals.png` | 2048×2048 | RGBA | Separated lightweight petals | small y drift; keep reduced-motion static |

## Typography reference

Suggested editorial headline stack: "EB Garamond", "Cormorant Garamond", Georgia, serif; weight 400.
Desktop title ~clamp(3.25rem, 6vw, 6.5rem); mobile 2.3rem–3.4rem with comfortable line-height.
Suggested label in small-caps: 0.7rem–0.85rem with 0.18em–0.25em letter spacing.
Burgundy headings `#71383C`, muted-gold small labels `#946B36`, readable copy `#795448`.
English specimen is a reference only. Burmese content needs a real Myanmar Unicode font with full shaping support.

## Suggested scroll scenes

1. Royal entrance: mist rises from the gateway and parchment appears.
2. Heading: Kanote-inspired crest rises; HTML heading enters; thin vine starts.
3. Chapter 1: original photo clipped in window under frame; HTML text and marker stagger.
4. Chapter 2: alternate chapter presentation on wide view, timeline extends.
5. Chapter 3: third customer photograph becomes the emotional focal point.
6. Finale: allow the real photograph to enlarge while gold framing recedes.
7. End: ivory mist and horizontal ornament connect to Section 5.

## Implementation checks

- Confirm SVG/CSS photo window geometry matches actual frame overlay as placed.
- Place text above background/ornaments in semantic HTML, never within PNG.
- Keep ScrollTrigger transitions reversible; avoid scroll jank on mobile.
- Provide static fallback and reduced-motion styles.
- Verify real photo permissions and crop positions per client.

## File counts

17 PNG files across 12 design components (some components have 2 or 3 variants).
