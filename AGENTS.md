# Agents

This file documents the Claude Code sub-agents available in this repository. Agents are defined in `.claude/agents/` and are invoked by Claude Code during agentic tasks.

---

## Overview

| Agent | File | When to use |
|-------|------|-------------|
| `site-analyzer` | `.claude/agents/site-analyzer.md` | Crawl a live site and produce a populated `site.config.json` |
| `test-generator` | `.claude/agents/test-generator.md` | Generate site-specific Playwright spec files from `site.config.json` |

---

## `site-analyzer`

**Role:** Crawls a live website and produces a fully-populated `site.config.json`.

**Invoke when:**
- Onboarding this repo to a new target site
- Verifying an existing `site.config.json` after a site redesign
- Running the `/analyze-site` slash command

**Inputs:**

| Input | Required | Description |
|-------|----------|-------------|
| `url` | Yes | The site URL to analyze |
| `companyName` | No | Override for company name (otherwise inferred) |

**Outputs:**
- A valid `site.config.json` written to the project root
- An "Issues found" checklist (missing meta description, broken nav links, no HTTPS, etc.)
- A confidence assessment (High / Medium / Low) with reasoning

**Key behaviours:**
- Follows redirects and uses the final canonical URL
- Dismisses cookie consent banners before inspecting structure
- Handles SPAs by waiting for `networkidle` + additional hydration delay
- Sets `auth.required: true` and `skipForms: true` for auth-gated sites
- Extracts nav items, detects contact forms, and infers the industry from page copy

---

## `test-generator`

**Role:** Reads a populated `site.config.json` and generates site-specific Playwright test files for functionality not covered by the shared suite.

**Invoke when:**
- A site has unique interactive elements (pricing calculator, video embeds, live chat)
- The shared generic selectors fail due to an unusual site structure
- Writing regression tests for a discovered bug
- Running the `/generate-full-suite` slash command

**Inputs:**

| Input | Required | Description |
|-------|----------|-------------|
| `siteConfig` | Yes | The populated `site.config.json` |
| `testScenarios` | No | Description of specific scenarios to cover |
| `pagesToTest` | No | Specific page paths to test (e.g., `/pricing`) |

**Outputs:**
- TypeScript spec files written to `tests/custom/<scenario>.spec.ts`
- Updated page object methods in `src/pages/` (if new selectors are needed)

**Conventions for generated files:**
- Import from `@fixtures/site.fixture` (not directly from `@playwright/test`)
- Tag custom tests `@custom` in addition to any other relevant tag
- No `async/await` anti-patterns — use Playwright's built-in auto-waiting
- No form submissions
- Strict TypeScript (`no implicit any`)

---

## Adding a New Agent

1. Create a `.md` file in `.claude/agents/` following the structure of existing agents.
2. Define: **Role**, **When to invoke**, **Capabilities**, **Inputs**, **Outputs**, **Step-by-step instructions**, and **Edge cases**.
3. Add a row to the table at the top of this file.
4. Reference the agent in `CLAUDE.md` if it is invoked by a slash command.

---

## Agent Design Rules

- Agents must not submit forms or create accounts.
- Agents must read `site.config.json` before generating selectors.
- Agents must use `WebFetch` to inspect the live site before writing locators.
- Generated TypeScript must pass `npx tsc --noEmit` with zero errors.
- All generated tests must be tagged with at least one suite tag.
