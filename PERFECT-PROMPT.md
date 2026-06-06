# THE PERFECT PROMPT — juliannesilla.com portfolio recreation
*Crystallized from your original asks + your LIVE site + your REAL assets. 2026-06-05.*

> Copy-paste this as the single source-of-truth brief for the rebuild. Everything below is verified against juliannesilla.com and your files on disk — nothing invented.

---

## THE PROMPT (paste-ready)

**"Recreate my portfolio, juliannesilla.com, in full — design + UI/UX forward. Reimagine it at award-tier quality (Awwwards level), inspired by dvdrod.com, the awwwards responsive-design picks, the pumpco hero, vivre/tenuta-di-murlo, mango-media's "nonsense," fluid.glass, and tomcardermedia — and I especially love the FLUID GLASS effect, so make that a signature moment. Add parallax / 3D / interactive on every page, but it must be BUTTERY SMOOTH — zero lag, 60fps, Lighthouse-green. Use my OFFICIAL brand palette (the charcoal + champagne gold + cream that's live on my site) and bold/editorial type. Use ONLY my REAL assets and REAL case studies — my clean studio headshot, my logo, my real case-study graphics, my real résumé content, my real footer/socials. Match my REAL voice (below). Build every page fully. Deliver it launch-ready so I can point juliannesilla.com at it."**

---

## WHO
Julianne Silla — **Director of Marketing · GTM Engineer · AI & Automation · Conversion Copywriter** — and a **UGC creator** (dual identity = the edge). SF Bay Area.
Real track record (résumé): HDMZ paid-search (oncology, ~$111K managed, 9.71% CTR ≈ 3× benchmark) · SariDLM Director ($1.5M revenue, 117 high-ticket enrollments, 600K+ podcast listens, 82 episodes, 40+ SOPs, 3 sold-out events).

## VOICE (verbatim from the live site — this is the real Julz, bolder than the prior build)
- **Hero:** "I build revenue engines that measure what matters — and kill what doesn't."
- **Secondary:** "Chaos into clarity, and clarity into revenue."
- **Mantra:** "Strategy. Systems. Scale. That's my lane."
- **Close / CTA:** "I can't wait to work with you."
- **Tone:** bold, confident, direct, results-first. No fluff. Punchy uppercase statements.

## OFFICIAL PALETTE (sampled from live juliannesilla.com — the canonical portfolio brand)
| Role | Hex | Name |
|------|-----|------|
| Base dark | `#0E0D0C` · `#15120F` · `#242424` · `#383737` | Charcoal / Ink |
| **Primary gold** | **`#CDAD7D`** | Champagne (the real primary — deeper than the build used) |
| Gold support | `#DBBF94` · `#C8A46A` · `#D6BA8D` | Champagne tints |
| Light | `#E5E2DD` · `#F6F4E7` | Cream / Ivory |
| Warm greys | `#BAB6A9` · `#7A7A70` · `#54554B` | Stone / Taupe |
| Jewel accent | `#0F52BA` | Sapphire blue (tiny accent — use *sparingly*; pairs beautifully with the gold) |

> NOTE: the pink/purple `Julz_Palette_v1` (#E55496 etc.) is your SEPARATE personal/UGC brand — **not** the portfolio. Portfolio = the editorial dark+gold above.

## TYPOGRAPHY (editorial + bold — you're open to suggestions; these match your live site)
- **Display (huge uppercase statements):** **Archivo Black** / Archivo 800–900. Confident, near-condensed, brutalist-editorial. *(Alt: Anton for even bolder.)*
- **Editorial serif accent:** **Playfair Display** (italic for moments like "chaos into clarity").
- **Body:** **Inter** (300–500).
- **Labels/eyebrows:** Archivo 600–700, uppercase, letter-spaced.

## REAL ASSETS (use these — no placeholders, no text-baked covers)
- **Hero headshot:** `OneDrive\Desktop\photos\JULZ-AVATAR-use-this.JPG` (studio, 2368×3552, clean). Lifestyle alt: `IMG_1040.JPG`.
- **Logo system:** `...\julz-claude-pc\logo-board.png` (JS monogram + wordmark, 6 lockups).
- **Case-study graphics (REAL, pro):** `Downloads\case01_high_ticket_launch_01..03` + `case06_ai_marketing_ops_01..05`; `assets\case-studies\v7-*-8K.png`.
- **Live-site reference (source of truth):** `assets\canva-site-export\live-page-01..07.png`.
- **Real footer:** tagline "STRATEGY THAT CONNECTS. STORIES THAT CONVERT." + phone 650-759-0995 + IG / TikTok / WhatsApp / Email.
- **Résumé:** `assets\docs\Julianne Silla - Resume.pdf`.

## SECTIONS (mirror the live site, elevated)
Hero + stats ($8M / 600K+ / 100+ / 40+ / 15+) → About ("revenue engines" + chaos→clarity + "Strategy. Systems. Scale. That's my lane.") → **GTM Timeline** → Context & Goals / Strategy & Execution → **Case Studies** (real graphics) → **Email** + **Podcast** work showcases → **Skills** grid → Lessons → Contact ("I can't wait to work with you" + real socials).

## INTERACTION (premium, performant)
Fluid glass signature + parallax + tasteful 3D tilt + scroll reveals + magnetic CTAs. **Every effect gated on `prefers-reduced-motion` AND performance-budgeted.**

## PERFORMANCE (the "fix lag" hard rule)
- **NO continuously-animated full-screen SVG filters** (that was the #1 lag source).
- Coalesce all pointer handlers (tilt/magnetic/refraction) into **one** rAF loop.
- `backdrop-filter` ≤ 10px, nav-only, **off on mobile**.
- Three.js: cap `pixelRatio` ≤ 1.5, pause when offscreen. Lenis: pause on `visibilitychange`.
- Targets: **60fps scroll**, LCP < 2.5s, CLS < 0.1, Lighthouse green.

## DEFINITION OF DONE
A single, definitive, launch-ready portfolio (your real site, reimagined premium) — accurate to your real brand + voice, all real assets, smooth as glass, ready to point juliannesilla.com at.
