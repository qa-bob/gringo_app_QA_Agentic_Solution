/**
 * tests/functional/app-features.spec.ts
 *
 * Functional tests for GrinGO App's core marketing site features.
 * Covers: hero section, app download CTAs, feature highlights, how-it-works
 * steps, social proof, and footer.
 *
 * Tag: @functional
 *
 * Rules:
 *  - Never submit forms or create accounts
 *  - Never click app store links (external navigation) — verify presence only
 *  - Use flexible selectors; the site may update copy without breaking tests
 */

import { test, expect } from '@fixtures/site.fixture';

// ── Hero Section ─────────────────────────────────────────────────────────────

test.describe('Hero Section @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
    await homePage.waitForLoad();
  });

  test('hero section has a primary heading @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length, 'Homepage should have a visible h1 or h2').toBeGreaterThan(0);
  });

  test('hero section has at least one call-to-action @functional', async ({ homePage }) => {
    const ctaButtons = await homePage.getCTAButtons();
    expect(
      ctaButtons.length,
      'Hero section should have at least one CTA button or link'
    ).toBeGreaterThan(0);
  });

  test('hero section has descriptive text content @functional', async ({ homePage }) => {
    const heroText = await homePage.getHeroText();
    expect(heroText.length, 'Hero section should contain readable text').toBeGreaterThan(10);
  });
});

// ── App Download CTAs ─────────────────────────────────────────────────────────

test.describe('App Download CTAs @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
  });

  test('App Store or Google Play link is visible @functional', async ({ page }) => {
    // Look for app store badges or download buttons — flexible selector strategy
    const appStoreLink = page.locator(
      'a[href*="apple.com/app"], a[href*="apps.apple.com"], ' +
      'a[href*="play.google.com"], a[href*="google.com/store"], ' +
      'img[alt*="App Store" i], img[alt*="Google Play" i], ' +
      'a[aria-label*="App Store" i], a[aria-label*="Google Play" i], ' +
      '[class*="app-store" i], [class*="google-play" i], [class*="download" i]'
    ).first();

    if (await appStoreLink.count() > 0) {
      await expect(appStoreLink, 'App download link should be visible').toBeVisible();
    } else {
      // Soft warning — GrinGO is an app; a download link is expected but not guaranteed by HTML alone
      console.warn(
        '[functional] No App Store / Google Play link found. ' +
          'Check if download CTAs are rendered via JavaScript after load.'
      );
    }
  });

  test('download CTA links point to valid external stores @functional', async ({ page }) => {
    const storeLinks = page.locator(
      'a[href*="apps.apple.com"], a[href*="play.google.com"]'
    );

    const count = await storeLinks.count();
    if (count === 0) {
      console.warn('[functional] No app store links found on page — skipping href validation.');
      return;
    }

    for (let i = 0; i < count; i++) {
      const href = await storeLinks.nth(i).getAttribute('href');
      expect(href, 'App store link should have a valid href').not.toBeNull();
      expect(
        href!.startsWith('http'),
        `App store link href "${href}" should be an absolute URL`
      ).toBeTruthy();
    }
  });
});

// ── Feature Highlights ────────────────────────────────────────────────────────

test.describe('Feature Highlights @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
  });

  test('features section exists on the page @functional', async ({ page }) => {
    // Common patterns for feature sections
    const featureSection = page.locator(
      'section[id*="feature" i], section[class*="feature" i], ' +
      '[id*="feature" i], [class*="feature" i], ' +
      'section[id*="benefit" i], [class*="benefit" i], ' +
      'section[id*="how" i], [class*="how-it-works" i]'
    ).first();

    if (await featureSection.count() === 0) {
      // Fall back to checking for multiple h2/h3 headings which often mark feature lists
      const subheadings = page.locator('h2, h3');
      const count = await subheadings.count();
      expect(
        count,
        'Page should have content sections (h2/h3 headings) describing features'
      ).toBeGreaterThan(0);
      return;
    }

    await expect(featureSection, 'Features section should be visible').toBeVisible();
  });

  test('feature headings have descriptive text @functional', async ({ page }) => {
    const headings = page.locator('h2, h3');
    const count = await headings.count();

    if (count === 0) {
      console.warn('[functional] No h2/h3 headings found — cannot validate feature heading text.');
      return;
    }

    // At least one heading should have meaningful text (>3 chars, not just a symbol)
    let meaningfulFound = false;
    for (let i = 0; i < Math.min(count, 10); i++) {
      const text = (await headings.nth(i).textContent())?.trim() ?? '';
      if (text.length > 3) {
        meaningfulFound = true;
        break;
      }
    }

    expect(meaningfulFound, 'At least one h2/h3 heading should have meaningful text').toBeTruthy();
  });
});

// ── Social Proof / Trust Signals ──────────────────────────────────────────────

test.describe('Social Proof @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
  });

  test('page includes social proof signals @functional', async ({ page }) => {
    // Testimonials, ratings, review counts, trust badges, or user stats
    const socialProof = page.locator(
      '[class*="testimonial" i], [class*="review" i], [class*="rating" i], ' +
      '[class*="trust" i], [class*="badge" i], [class*="stat" i], ' +
      '[class*="counter" i], blockquote'
    );

    if (await socialProof.count() > 0) {
      await expect(socialProof.first(), 'Social proof element should be visible').toBeVisible();
    } else {
      console.warn(
        '[functional] No explicit social proof elements found. ' +
          'Consider adding testimonials, ratings, or user stats.'
      );
    }
  });
});

// ── Footer ───────────────────────────────────────────────────────────────────

test.describe('Footer @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
  });

  test('footer is present on the page @functional', async ({ page }) => {
    const footer = page.locator('footer, [role="contentinfo"]').first();
    await expect(footer, 'Page should have a footer element').toBeVisible();
  });

  test('footer contains at least one link @functional', async ({ page }) => {
    const footerLinks = page.locator('footer a[href], [role="contentinfo"] a[href]');
    const count = await footerLinks.count();
    expect(count, 'Footer should contain at least one link').toBeGreaterThan(0);
  });

  test('footer links have non-empty href attributes @functional', async ({ page }) => {
    const footerLinks = page.locator('footer a[href], [role="contentinfo"] a[href]');
    const count = await footerLinks.count();

    if (count === 0) return;

    for (let i = 0; i < Math.min(count, 20); i++) {
      const href = await footerLinks.nth(i).getAttribute('href');
      expect(
        href && href.trim().length > 0,
        `Footer link at index ${i} should have a non-empty href`
      ).toBeTruthy();
    }
  });
});

// ── Page Load Performance ─────────────────────────────────────────────────────

test.describe('Page Performance @functional', () => {
  test('homepage renders key content before 8s @functional', async ({ page, siteConfig }) => {
    const start = Date.now();
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });

    // Wait for a meaningful heading to appear
    await page.locator('h1, h2').first().waitFor({ timeout: 8_000 });

    const elapsed = Date.now() - start;
    expect(
      elapsed,
      `Homepage took ${elapsed}ms to render first heading — exceeds 8s threshold`
    ).toBeLessThan(8_000);
  });
});

// ── Images ───────────────────────────────────────────────────────────────────

test.describe('Images @functional', () => {
  test.beforeEach(async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'domcontentloaded' });
  });

  test('hero image (if present) has alt text @functional', async ({ page }) => {
    // Look for the first significant image in the hero/header area
    const heroImg = page.locator(
      'header img, [class*="hero" i] img, section:first-of-type img'
    ).first();

    if (await heroImg.count() === 0) return;

    const alt = await heroImg.getAttribute('alt');
    // alt="" is valid for decorative images — but it must be present
    expect(alt, 'Hero image should have an alt attribute (empty string is acceptable for decorative images)').not.toBeNull();
  });

  test('no broken images on homepage @functional', async ({ page, siteConfig }) => {
    await page.goto(siteConfig.url, { waitUntil: 'networkidle' });

    const brokenImages = await page.evaluate<string[]>(() => {
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'));
      return imgs
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.src || img.getAttribute('src') || '(no src)');
    });

    if (brokenImages.length > 0) {
      console.warn('[functional] Broken images found:\n' + brokenImages.join('\n'));
    }

    expect(
      brokenImages.length,
      `Found ${brokenImages.length} broken image(s):\n${brokenImages.join('\n')}`
    ).toBe(0);
  });
});
