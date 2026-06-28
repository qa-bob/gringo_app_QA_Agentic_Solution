# GitHub Copilot & AI Assistant Instructions

This file provides context for GitHub Copilot and other AI coding assistants working in this repository.

---

## What This Repo Is

A **Playwright + TypeScript regression test suite** for [GrinGO App](http://www.gringoapp.com/) — a travel and safety app for travelers to Mexico.

The framework follows the **Page Object Model (POM)** design pattern and **Object-Oriented Programming (OOP)** principles.

---

## Architecture at a Glance

```
src/pages/        ← Page Object Model classes (extend BasePage)
src/fixtures/     ← Custom Playwright fixture (injects page objects into tests)
src/utils/        ← Shared helpers (link checker, visual diffing)
src/types/        ← TypeScript interfaces (SiteConfig)
tests/smoke/      ← @smoke — site availability
tests/navigation/ ← @navigation — nav links, mobile menu
tests/forms/      ← @forms — form fields, validation (no submission)
tests/functional/ ← @functional — business features, CTAs
tests/visual/     ← @visual — screenshot regression
tests/responsive/ ← @responsive — viewport layout
```

---

## Hard Rules

These constraints must never be violated — do not suggest code that breaks them:

1. **Never submit forms.** No `form.submit()`, no clicking submit buttons without intercepting the POST.
2. **Never create accounts.** No signup/registration flows.
3. **Never hardcode the base URL.** Use `siteConfig.url` or `baseURL` from Playwright config.
4. **Never use `page.waitForTimeout()`** — use Playwright's built-in auto-waiting (`waitForSelector`, `waitForLoadState`, etc.).
5. **No assertions in page objects.** `expect()` belongs only in spec files.
6. **No `any` types** without an explicit justification comment.

---

## Code Patterns to Follow

### Adding a new page object

```typescript
// src/pages/features.page.ts
import { type Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';

export class FeaturesPage extends BasePage {
  readonly featureCards: Locator;

  constructor(page: Page, config: SiteConfig) {
    super(page, config);
    this.featureCards = page.locator('[class*="feature-card"], [class*="feature-item"]');
  }

  async getFeatureCount(): Promise<number> {
    return this.featureCards.count();
  }
}
```

### Adding a test

```typescript
// tests/functional/features.spec.ts
import { test, expect } from '@fixtures/site.fixture';

test.describe('Features Section @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('features section lists at least one feature @functional', async ({ page }) => {
    const cards = page.locator('[class*="feature"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(0);
  });
});
```

### Importing

```typescript
// Always use path aliases — never relative ../../ paths
import { test, expect } from '@fixtures/site.fixture';
import { BasePage } from '@pages/base.page';
import type { SiteConfig } from '@app-types/site-config.types';
```

---

## Selector Preferences (in order)

1. `page.getByRole('button', { name: /download/i })`
2. `page.getByLabel('Email address')`
3. `page.getByText('Get Started')`
4. `page.locator('[data-testid="hero"]')`
5. `page.locator('[class*="partial-class"]')` — last resort

Avoid nth-child, XPath, and inline-style selectors.

---

## TypeScript Rules

- Strict mode is on — all variables must be typed.
- Page object locator properties: `readonly myLocator: Locator`.
- Async methods return `Promise<T>` — always annotate the return type.
- Run `npx tsc --noEmit` before suggesting code is complete.

---

## Test Tags

Every test must include at least one tag:

| Tag | Suite |
|-----|-------|
| `@smoke` | Availability |
| `@navigation` | Navigation |
| `@forms` | Forms |
| `@functional` | Functional |
| `@visual` | Visual |
| `@responsive` | Responsive |
| `@custom` | Site-specific |

Tags appear both in the `test.describe` label and in each individual `test()` label.
