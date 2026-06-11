# juliannesilla-portfolio — Standing Rules

## REGRESSION GATE (non-negotiable, Julz 2026-06-11)
This repo serves Julz's LIVE 64-page portfolio (8 design directions, GitHub Pages).
A Playwright suite guards it (tests/portfolio.spec.ts).

1. **BEFORE any design/content change**: run `npx playwright test` — confirm GREEN baseline.
2. **AFTER the change, BEFORE `git push`**: run `npx playwright test` again — ALL GREEN or do not push.
3. Never push on red. Fix or revert first. Never edit tests to make a regression pass —
   tests change ONLY when Julz changes a locked design decision.
