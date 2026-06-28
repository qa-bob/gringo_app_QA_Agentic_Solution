# Contributing to GrinGO App QA Agentic Solution

Thank you for contributing to this test suite. This guide covers everything you need to know before opening a PR.

---

## Core Constraints (non-negotiable)

These rules protect the site and keep the test suite trustworthy:

- **Never submit a form.** Test field interactions and validation only.
- **Never create an account or log in** (unless `auth.required: true` in `site.config.json`).
- **Never hardcode the base URL.** Use `baseURL` from the Playwright config or `siteConfig.url` from the fixture.
- **Never use `page.waitForTimeout()`** — use `waitForSelector`, `waitForLoadState`, or Playwright's built-in auto-waiting instead.

---

## Development Setup

```bash
npm install
npx playwright install --with-deps
npm run typecheck   # should pass with zero errors
```

---

## Project Architecture

### Page Object Model (POM)

Every page or major section has its own class in `src/pages/` that extends `BasePage`.

```
BasePage (src/pages/base.page.ts)
  ├── HomePage
  ├── NavigationPage
  ├── ContactFormPage
  └── <YourNewPage>
```

**Rules for page object classes:**

| Rule | Detail |
|------|--------|
| Extend `BasePage` | `class MyPage extends BasePage` |
| Typed locators | `readonly myButton: Locator` |
| No assertions | `expect()` belongs in spec files |
| Methods = user actions | `async clickPrimaryButton()` not `assertButtonVisible()` |
| No hardcoded URLs | Use `this.url` from `BasePage` |

### Fixtures

Tests get page objects injected via the custom fixture:

```typescript
import { test, expect } from '@fixtures/site.fixture';

test('my test', async ({ homePage, siteConfig }) => {
  // homePage is already navigated
});
```

Do not import `test` or `expect` directly from `@playwright/test` in spec files.

### Path Aliases

Use these instead of relative `../../../` imports:

| Alias | Resolves to |
|-------|------------|
| `@pages/*` | `src/pages/*` |
| `@fixtures/*` | `src/fixtures/*` |
| `@utils/*` | `src/utils/*` |
| `@app-types/*` | `src/types/*` |

---

## Writing Tests

### File placement

| Test type | Directory | Tag |
|-----------|-----------|-----|
| Availability, HTTP status | `tests/smoke/` | `@smoke` |
| Navigation, routing | `tests/navigation/` | `@navigation` |
| Form fields, validation | `tests/forms/` | `@forms` |
| Business features, CTAs | `tests/functional/` | `@functional` |
| Screenshot regression | `tests/visual/` | `@visual` |
| Responsive layout | `tests/responsive/` | `@responsive` |
| Site-specific custom | `tests/custom/` | `@custom` |

### Test structure

```typescript
import { test, expect } from '@fixtures/site.fixture';

test.describe('Feature Name @functional', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.navigate();
  });

  test('describes what is asserted @functional', async ({ homePage }) => {
    const heading = await homePage.getMainHeading();
    expect(heading.length).toBeGreaterThan(0);
  });
});
```

- One `describe` block per page or feature area.
- Each test is independent — no shared state between tests.
- Tag every test with at least one suite tag.
- Prefer `toBeVisible()`, `toHaveText()`, and role-based assertions over `.count()` checks.

### Selectors

Prefer this order:

1. `getByRole()` — most resilient to markup changes
2. `getByLabel()` / `getByPlaceholder()` — for form fields
3. `getByText()` — for content assertions
4. `locator('[data-testid="..."]')` — when test IDs are present
5. CSS class selectors — last resort; use `[class*="partial"]` to be flexible

Avoid:
- `nth-child` positional selectors
- XPath
- Selectors tied to inline styles

---

## Before Opening a PR

```bash
npm run typecheck   # zero TypeScript errors required
npm run lint        # zero ESLint errors required
npm run test:smoke  # smoke suite must pass
```

Run the specific suite for any tests you added or changed:

```bash
npm run test:functional  # if you touched functional tests
```

---

## Branch Naming

```
feat/short-description       # new test coverage
fix/short-description        # bug fix in existing tests
chore/short-description      # config, CI, dependencies
refactor/short-description   # page object refactoring
```

---

## Pull Request Process

1. Fill in the PR template completely.
2. Assign at least one reviewer.
3. Ensure CI passes (GitHub Actions runs the full suite automatically).
4. If your PR includes visual baseline changes, include before/after screenshots in the description.
5. Squash commits before merging.

---

## Updating `site.config.json`

Run `/analyze-site` in Claude Code to regenerate the config from the live site:

```
/analyze-site
```

Always review the diff before committing — nav items may have changed intentionally.

---

## Questions?

Open a GitHub Issue using the "Test Coverage Request" template or tag `@qa` in your PR.
