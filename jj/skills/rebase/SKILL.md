---
name: rebase
description: Rebase the current jj (Jujutsu) changeset stack onto the latest trunk. This skill should be used when the user wants to "rebase my stack", "update onto main/trunk", or sync a jj stack with upstream. Stops and reports on conflicts rather than auto-resolving. For committing or opening PRs use jj:commit / jj:commit-push-pr instead.
---

# Rebase Current Stack

Rebase the current changeset stack (from its root through `@`) onto the latest trunk.

## Context expectations

When invoked from `/jj:rebase`, the latest changes are already fetched and the stack root is already in context. Do not re-fetch. If invoked directly, fetch first:

```bash
jj git fetch
```

## Process

1. **Identify the stack root:**
   ```bash
   jj log -r 'roots(::@ ~ ::trunk())'
   ```
   - Finds the earliest changeset in the current stack that's not on trunk
   - If this returns nothing, you're already on trunk — report that and stop

2. **Rebase the stack:**
   ```bash
   jj rebase -s 'roots(::@ ~ ::trunk())' -d trunk()
   ```
   - Rebases the entire stack onto trunk using the same revset for consistency

3. **Show result:**
   ```bash
   jj log
   ```

## Handling conflicts

If the rebase reports conflicts:
1. Run `jj status --no-pager` to see conflicted files
2. Report the conflicts to the user
3. Do NOT attempt to resolve automatically — let the user decide

## Edge cases

- **Empty working copy (`@` has no changes):** Normal in jj; the rebase still works on the stack.
- **Already on trunk:** If `roots(::@ ~ ::trunk())` returns nothing, tell the user they're up to date.
- **trunk() not configured:** Fall back to checking `main@origin` or `master@origin` (prefer `main@origin`):
  ```bash
  jj log -r 'main@origin | master@origin' --no-graph -T 'self.bookmarks()'
  ```

## Notes

- `trunk()` is jj's built-in revset for the primary branch (respects repo config)
- `-s` rebases the source and all descendants
- `::@` means "all ancestors of @ including @"; `~ ::trunk()` excludes trunk and its ancestors
