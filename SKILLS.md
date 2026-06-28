# Skills

This file documents the Claude Code slash commands (skills) available in this repository. Skills are defined in `.claude/commands/` and are invoked from the Claude Code prompt with a `/` prefix.

---

## Available Skills

| Command | File | Description |
|---------|------|-------------|
| `/analyze-site` | `.claude/commands/analyze-site.md` | Crawl the live site and update `site.config.json` |
| `/generate-full-suite` | `.claude/commands/generate-full-suite.md` | Generate a complete POM + test suite from scratch |
| `/run-smoke` | `.claude/commands/run-smoke.md` | Run `@smoke` tests and report results |
| `/update-baseline` | `.claude/commands/update-baseline.md` | Refresh visual regression snapshots |
| `/generate-report` | `.claude/commands/generate-report.md` | Produce a formatted test-results summary |

---

## `/analyze-site`

**Usage:** `/analyze-site [url]`

Navigates to the site URL (from `site.config.json` if omitted), inspects the DOM, and produces an updated `site.config.json`. Reports any SEO or accessibility issues found during the crawl.

**When to use:**
- First-time onboarding of a new company site
- After a site redesign to refresh expected nav items and metadata
- To verify the current `site.config.json` is still accurate

**Output:** Updated `site.config.json` + issues checklist.

---

## `/generate-full-suite`

**Usage:** `/generate-full-suite`

Reads the current `site.config.json`, crawls the live site, and generates or updates the complete test suite — page objects, fixtures, and spec files — to cover all discoverable pages and features.

**When to use:**
- Bootstrapping tests for a brand-new site
- After a major site redesign requires test rewrites
- When test coverage is significantly out of date

**Output:** Updated files in `src/pages/`, `src/fixtures/`, and `tests/`.

---

## `/run-smoke`

**Usage:** `/run-smoke`

Executes `npm run test:smoke` and reports results in a human-readable format — pass/fail counts, error messages for failures, and elapsed time.

**When to use:**
- Quick sanity check that the site is up and tests can run
- After any configuration change
- As a first step before running the full suite

**Output:** Pass/fail summary with error details for any failures.

---

## `/update-baseline`

**Usage:** `/update-baseline`

Runs `npm run baseline` to regenerate all visual regression snapshots in `__snapshots__/`. Should be run after intentional design changes.

**When to use:**
- After a confirmed UI/design change has been deployed
- When setting up visual tests for the first time on a new viewport

**Output:** Updated `__snapshots__/` files. Commit these alongside the design change.

---

## `/generate-report`

**Usage:** `/generate-report`

Reads `test-results/results.json` (from the last test run) and produces a formatted Markdown summary with pass/fail counts per suite, slowest tests, and any error messages.

**When to use:**
- After a CI run to summarise results in a PR comment
- To share test status with stakeholders

**Output:** Formatted Markdown test report.

---

## Adding a New Skill

1. Create a `.md` file in `.claude/commands/` following the structure of existing commands.
2. Include: **Usage**, **What this command does** (numbered steps), **Output format**, and **Edge case handling**.
3. Add a row to the table at the top of this file.
4. If the skill invokes a sub-agent, add the agent to `AGENTS.md` too.

---

## Skill Design Rules

- Skills must read `site.config.json` before interacting with the live site.
- Skills must not submit forms or create accounts.
- Skills that generate TypeScript must verify it compiles (`npx tsc --noEmit`).
- Skills that modify files should report what changed.
