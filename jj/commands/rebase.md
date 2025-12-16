# Rebase Current Stack

Rebase the current changeset stack onto the latest trunk.

## Process

1. **Fetch latest changes:**
   ```bash
   jj git fetch
   ```

2. **Identify the stack root:**
   ```bash
   jj log -r 'roots(::@ ~ ::trunk())'
   ```
   - This finds the earliest changeset in the current stack that's not on trunk
   - If this returns nothing, you're already on trunk - nothing to rebase

3. **Rebase the stack:**
   ```bash
   jj rebase -s 'roots(::@ ~ ::trunk())' -d trunk()
   ```
   - This rebases the entire stack (from root through `@`) onto trunk
   - Uses the same revset expression to ensure consistency

4. **Show result:**
   ```bash
   jj log
   ```

## Handling Conflicts

If rebase reports conflicts:
1. Run `jj status --no-pager` to see conflicted files
2. Report the conflicts to the user
3. Do NOT attempt to resolve automatically - let the user decide how to proceed

## Edge Cases

**Empty working copy (`@` has no changes):**
- This is normal in jj - the working copy can be empty
- The rebase still works; it rebases the stack

**Already on trunk:**
- If `roots(::@ ~ ::trunk())` returns nothing, inform the user they're already up to date

**trunk() not configured:**
- If `trunk()` fails, fall back to checking for `main@origin` or `master@origin`:
  ```bash
  jj log -r 'main@origin | master@origin' --no-graph -T 'self.bookmarks()'
  ```
- Use whichever exists (prefer `main@origin`)

## Notes

- `trunk()` is jj's built-in revset for the primary branch (respects repo config)
- `-s` rebases the source and all descendants
- `::@` means "all ancestors of @ including @"
- `~ ::trunk()` excludes trunk and its ancestors
