## Summary

<!-- One or two sentences describing what this PR adds, fixes, or changes. -->

## Type of Change

- [ ] New test coverage (`tests/`)
- [ ] New or updated page object (`src/pages/`)
- [ ] Bug fix in existing tests
- [ ] Configuration change (`playwright.config.ts`, `site.config.json`)
- [ ] CI/CD change (`.github/workflows/`)
- [ ] Documentation update

## Tests Added or Modified

<!-- List the spec files touched and what scenarios they cover. -->

| File | Tags | Description |
|------|------|-------------|
| `tests/...` | `@tag` | |

## Checklist

- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero warnings or errors
- [ ] `npm run test:smoke` passes
- [ ] The relevant test suite (`test:navigation`, `test:forms`, etc.) passes
- [ ] No form submissions in any test
- [ ] No hardcoded URLs — `siteConfig.url` / `baseURL` used throughout
- [ ] No `page.waitForTimeout()` calls
- [ ] No `expect()` calls inside page object classes
- [ ] All new tests are tagged with at least one suite tag

## Visual Changes

<!-- If visual baselines were updated, paste before/after screenshots here. -->

## Notes for Reviewer

<!-- Anything the reviewer should know: tricky selector choices, known flakiness, edge cases handled. -->
