# GrinGO App — QA Agentic Solution

Playwright + TypeScript regression test suite for [GrinGO App](http://www.gringoapp.com/) — a travel and safety app for travelers to Mexico.

This framework uses the **Page Object Model (POM)** design pattern and **Object-Oriented Programming (OOP)** principles to keep test code maintainable, type-safe, and readable. It is designed for agentic execution by Claude Code.

---

## What This Repo Tests

| Area | Spec File | Tags |
|------|-----------|------|
| Site availability & HTTP status | `tests/smoke/site-availability.spec.ts` | `@smoke` |
| Primary navigation & mobile menu | `tests/navigation/nav-links.spec.ts` | `@navigation` |
| Contact form fields & validation | `tests/forms/contact-form.spec.ts` | `@forms` |
| App features, CTAs, content sections | `tests/functional/app-features.spec.ts` | `@functional` |
| Screenshot regression baselines | `tests/visual/visual-regression.spec.ts` | `@visual` |
| Responsive layout at all viewports | `tests/responsive/layout.spec.ts` | `@responsive` |

> Tests never submit forms, create accounts, or enter real credentials.

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18.x |
| npm | >= 9.x |
| Git | any recent |

---

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/<org>/gringo_app_QA_Agentic_Solution.git
cd gringo_app_QA_Agentic_Solution

# 2. Install Node dependencies
npm install

# 3. Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install --with-deps

# 4. (Optional) copy the env template
cp .env.example .env
```

The site URL is read from `site.config.json`. You can override it at runtime:

```bash
SITE_URL=https://staging.gringoapp.com npm test
```

---

## Running Tests

```bash
# All tests
npm test

# Smoke only (fastest — runs first in CI)
npm run test:smoke

# Navigation tests
npm run test:navigation

# Form validation tests
npm run test:forms

# Functional / business-logic tests
npm run test:functional

# Visual regression (requires baselines — see below)
npm run test:visual

# Responsive layout
npm run test:responsive

# Open the HTML report after any run
npm run report

# Run headed (visible browser window)
npm run test:headed
```

### Updating Visual Baselines

Run this whenever the site's design changes intentionally:

```bash
npm run baseline
```

Commit the updated `__snapshots__/` files alongside the design change.

---

## Project Architecture

```
gringo_app_QA_Agentic_Solution/
├── site.config.json          # Site URL, flags, expected nav items
├── playwright.config.ts      # Browser projects, reporters, global settings
├── global-setup.ts           # Pre-run reachability check
├── tsconfig.json             # Strict TypeScript, path aliases
│
├── src/
│   ├── pages/                # Page Object Model classes (one per page/section)
│   │   ├── base.page.ts      # BasePage — shared navigation, helpers, screenshots
│   │   ├── home.page.ts      # HomePage — hero, CTAs, headings
│   │   ├── navigation.page.ts# NavigationPage — nav links, mobile menu
│   │   └── contact.page.ts   # ContactFormPage — form fields, submit button
│   ├── fixtures/
│   │   └── site.fixture.ts   # Custom Playwright fixture — exposes page objects to tests
│   ├── utils/
│   │   ├── link-checker.ts   # HTTP link reachability helper
│   │   └── visual-helper.ts  # Screenshot diff utilities
│   └── types/
│       └── site-config.types.ts  # SiteConfig interface + loader
│
├── tests/
│   ├── smoke/                # @smoke — availability, HTTP status, title
│   ├── navigation/           # @navigation — nav links, mobile menu, logo
│   ├── forms/                # @forms — fields, validation (no submission)
│   ├── functional/           # @functional — app features, CTAs, content
│   ├── visual/               # @visual — screenshot regression
│   └── responsive/           # @responsive — viewport layout checks
│
├── .claude/
│   ├── commands/             # Slash commands for Claude Code
│   └── agents/               # Sub-agent definitions
│
└── .github/
    ├── workflows/            # CI/CD pipelines
    ├── CONTRIBUTING.md       # Contributor guide
    ├── PULL_REQUEST_TEMPLATE.md
    └── ISSUE_TEMPLATE/       # Bug report & coverage request templates
```

### Design Principles

**Page Object Model (POM):** Every page or major section has its own class in `src/pages/` that extends `BasePage`. Locators are `readonly Locator` properties. Methods represent user actions. No assertions inside page objects — they belong in test files.

**Object-Oriented Programming:** Page classes inherit shared behaviour from `BasePage` (navigate, screenshot, console-error collection). Specialised pages override or extend as needed.

**Fixture-based composition:** Tests import `{ test, expect }` from `@fixtures/site.fixture`, which injects pre-built page objects. Raw `page.locator()` calls do not appear in spec files.

**Tag-based execution:** Every test carries at least one tag (`@smoke`, `@navigation`, etc.) so CI can run specific suites independently.

---

## Type Checking & Linting

Run these before every commit or PR:

```bash
npm run typecheck   # tsc --noEmit — must pass with zero errors
npm run lint        # ESLint over src/ and tests/
```

---

## CI/CD

GitHub Actions runs the full test suite on every push and pull request to `main`. See `.github/workflows/playwright.yml`.

Results are uploaded as artifacts (HTML report + JSON results).

---

## Contributor Rules

See [`.github/CONTRIBUTING.md`](.github/CONTRIBUTING.md) for the full guide. Short version:

1. **Never submit forms or create accounts** in tests.
2. **Use `@fixtures/site.fixture`** — do not import directly from `@playwright/test`.
3. **No hardcoded URLs** — always use `baseURL` (which comes from `site.config.json`).
4. **No assertions in page objects** — `expect()` lives in spec files only.
5. **No `page.waitForTimeout()`** — use Playwright's auto-waiting or `waitForSelector`.
6. **Run `npm run typecheck`** before opening a PR.
7. **Tag every test** with at least one suite tag.

---

## Claude Code Slash Commands

| Command | What it does |
|---------|-------------|
| `/analyze-site` | Crawls the live site and updates `site.config.json` |
| `/generate-full-suite` | Generates a complete POM + test suite from scratch |
| `/run-smoke` | Runs `@smoke` tests and reports results |
| `/update-baseline` | Refreshes visual regression snapshots |
| `/generate-report` | Produces a test-results summary |

See `AGENTS.md` and `SKILLS.md` for the full agent and skill reference.

---

## Supported Viewports

| Project | Viewport | Device |
|---------|---------|--------|
| `chromium-desktop` | 1280 × 720 | Desktop Chrome |
| `mobile-chrome` | 390 × 844 | Pixel 5 |
| `tablet` | 768 × 1024 | iPad Mini |
