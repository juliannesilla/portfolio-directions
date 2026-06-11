import { test, expect, APIRequestContext, APIResponse, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/** The 8 design-direction folders under /versions/. */
const DIRECTIONS = [
  'v1-data-editorial',
  'v2-silk',
  'v3-cinematic',
  'v4-editorial-luxe',
  'v5-spatial',
  'v6-liquid-glass',
  'v7-story-whitespace',
  'v8-atelier',
] as const;

/** The 8 pages every direction ships. */
const DIRECTION_PAGES = [
  'index',
  'about',
  'work',
  'case-study',
  'services',
  'ugc',
  'resources',
  'contact',
] as const;

/** Candidate pages of the final site/ build — only tested if present on disk. */
const SITE_PAGES = [
  'index',
  'about',
  'work',
  'case-study',
  'services',
  'ugc',
  'resources',
  'contact',
] as const;

const REPO_ROOT = path.resolve(__dirname, '..');

/**
 * GET with a bounded retry. python -m http.server has a 5-connection TCP
 * backlog; under parallel workers Windows refuses overflow connections
 * (ECONNREFUSED) instead of queueing them, so transient refusals are a
 * server limitation, not a site defect.
 */
async function getWithRetry(
  request: APIRequestContext,
  urlPath: string,
  attempts = 4,
): Promise<APIResponse> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await request.get(urlPath);
    } catch (error) {
      lastError = error;
      // Back off so the next attempt lands after the backlog drains.
      await new Promise((resolve) => setTimeout(resolve, 250 * attempt));
    }
  }
  throw lastError;
}

/** Attach a console-error collector to a page before navigation. */
function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}

test.describe('version gallery', () => {
  test('gallery loads and links all 8 direction sites', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);

    await page.goto('/versions/gallery.html');

    await expect(page).not.toHaveTitle('');

    for (const dir of DIRECTIONS) {
      await expect(
        page.locator(`a[href*="${dir}/index.html"]`).first(),
        `gallery should link to ${dir}`,
      ).toBeAttached();
    }

    expect(consoleErrors).toEqual([]);
  });
});

test.describe('direction page inventory', () => {
  test('all 64 direction pages return 200 with complete HTML', async ({ request }) => {
    const failures: string[] = [];

    for (const dir of DIRECTIONS) {
      for (const pageName of DIRECTION_PAGES) {
        const urlPath = `/versions/${dir}/${pageName}.html`;
        const response = await getWithRetry(request, urlPath);

        if (response.status() !== 200) {
          failures.push(`${urlPath} -> HTTP ${response.status()}`);
          continue;
        }

        const body = await response.text();
        if (!body.includes('</html>')) {
          failures.push(`${urlPath} -> truncated (missing </html>)`);
        }
        if (body.toLowerCase().includes('lorem')) {
          failures.push(`${urlPath} -> contains placeholder "lorem" text`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});

test.describe('direction home smoke', () => {
  for (const dir of DIRECTIONS) {
    test(`${dir} home renders clean`, async ({ page }) => {
      const consoleErrors = collectConsoleErrors(page);

      await page.goto(`/versions/${dir}/index.html`);

      // A recognizable shell: a top-level heading, a name block, or site nav.
      await expect(
        page.locator('h1, .name, nav').first(),
        'page should render an h1, .name, or nav',
      ).toBeVisible();

      // No user-visible horizontal scroll at the 1280x800 desktop viewport.
      // Decorative bleed elements clipped by overflow-x:hidden/clip on
      // html/body do not produce a scrollbar, so they are not flagged.
      const horizontallyScrollable = await page.evaluate(() => {
        const root = document.documentElement;
        const clipped = [root, document.body].some((el) =>
          ['hidden', 'clip'].includes(getComputedStyle(el).overflowX),
        );
        return !clipped && root.scrollWidth - root.clientWidth > 1;
      });
      expect(horizontallyScrollable, 'horizontal scroll detected (scrollWidth > clientWidth)').toBe(false);

      // Every rendered <img> actually loads. Lazy images need to enter the
      // viewport first, so scroll each into view and poll for completion.
      const images = page.locator('img');
      const imageCount = await images.count();
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const isRendered = await img.evaluate((el) => el.getClientRects().length > 0);
        if (!isRendered) continue; // hidden at this viewport — lazy load never fires

        const src = (await img.getAttribute('src')) ?? '(no src)';
        await img.scrollIntoViewIfNeeded();
        await expect
          .poll(
            () =>
              img.evaluate((el: HTMLImageElement) => {
                if (el.complete && el.naturalWidth > 0) return true;
                // A fetch refused by python http.server's tiny TCP backlog
                // leaves the image permanently failed — re-trigger it
                // (bounded). A genuine 404 exhausts retries and still fails.
                const attempts = Number(el.dataset.pwRetry ?? '0');
                if (el.complete && el.naturalWidth === 0 && attempts < 3) {
                  el.dataset.pwRetry = String(attempts + 1);
                  const currentSrc = el.getAttribute('src');
                  if (currentSrc) el.setAttribute('src', currentSrc);
                }
                return false;
              }),
            { message: `image failed to load: ${src}` },
          )
          .toBe(true);
      }

      expect(consoleErrors).toEqual([]);
    });
  }
});

test.describe('final site/ pages', () => {
  const existingSitePages = SITE_PAGES.filter((pageName) =>
    fs.existsSync(path.join(REPO_ROOT, 'site', `${pageName}.html`)),
  );

  test('every site/ page on disk responds with complete HTML', async ({ request }) => {
    expect(existingSitePages.length, 'site/ should contain at least one page').toBeGreaterThan(0);

    const failures: string[] = [];

    for (const pageName of existingSitePages) {
      const urlPath = `/site/${pageName}.html`;
      const response = await getWithRetry(request, urlPath);

      if (response.status() !== 200) {
        failures.push(`${urlPath} -> HTTP ${response.status()}`);
        continue;
      }

      const body = await response.text();
      if (!body.includes('</html>')) {
        failures.push(`${urlPath} -> truncated (missing </html>)`);
      }
    }

    expect(failures).toEqual([]);
  });
});
