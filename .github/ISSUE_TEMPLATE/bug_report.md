---
name: Bug report
about: A test is failing, flaky, or producing incorrect results
title: "[BUG] "
labels: bug
assignees: ''
---

## Test File

<!-- Path to the failing spec, e.g. tests/navigation/nav-links.spec.ts -->

## Failing Test Name

<!-- Copy the full test title including describe block -->

## Expected Behaviour

<!-- What should happen? -->

## Actual Behaviour

<!-- What actually happens? Paste error message or screenshot. -->

## Steps to Reproduce

```bash
npm run test:smoke   # or whichever suite contains the failing test
```

1.
2.

## Error Output

```
<!-- Paste Playwright error output here -->
```

## Environment

| Field | Value |
|-------|-------|
| OS | |
| Node version | |
| Playwright version | |
| Branch | |
| Site URL tested | |

## Possible Cause

<!-- Is this a selector change on the site? A Playwright version issue? A flaky network check? -->
