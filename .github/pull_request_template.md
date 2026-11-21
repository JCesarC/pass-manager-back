<!--
  PR title: use Conventional Commits, e.g. `feat(auth): add refresh token rotation`.
  Keep PRs small and focused. Delete any section that does not apply, but say "None" instead of
  deleting Breaking changes, Security and Rollback: an explicit "None" is information too.
-->

## Summary

<!-- What does this PR do and, above all, WHY? 2–4 sentences a reviewer can read in 30 seconds. -->

## Type of change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] Feature (non-breaking change that adds functionality)
- [ ] Refactor (no functional change)
- [ ] Chore / build / dependencies
- [ ] Documentation
- [ ] ⚠️ Breaking change (consumers, config or data must change)

## Related

<!-- Issues, roadmap items, ADRs, design docs, previous PRs. -->

- Closes #
- Roadmap:

## Changes

<!-- Group by area. Focus on intent, not on listing every file. -->

-

## Breaking changes & migration

<!-- What breaks and the exact steps to migrate (env vars, API contracts, DB data). Otherwise: "None". -->

None.

## How to test

<!-- Reproducible steps a reviewer can copy-paste. Include setup and expected results. -->

1.

## Verification

<!-- Evidence that it works: commands run and their results, screenshots, logs, coverage. -->

| Check | Result |
|---|---|
| Type check | |
| Lint | |
| Tests | |
| Build | |
| Manual / smoke test | |

## Security & privacy

<!-- Auth/authorization changes, input validation, secrets, PII, new dependencies and their audit. Otherwise: "No impact". -->

## Deployment & rollback

<!-- Required config, migrations, ordering with other services, feature flags. How do we roll back? -->

## Out of scope / follow-ups

<!-- What was deliberately left out, and where it is tracked. -->

-

## Reviewer notes

<!-- Where to focus, what is mechanical, suggested review order (e.g. commit by commit). -->

## Checklist

- [ ] I reviewed my own diff and removed debug code
- [ ] Commits follow Conventional Commits and each one has a single purpose
- [ ] Tests added or updated (or the reason they are not needed is explained above)
- [ ] Documentation updated (README, API docs, ADRs, roadmap)
- [ ] No secrets, credentials or personal data in code, history or logs
- [ ] Breaking changes are documented with migration steps
- [ ] CI is green
