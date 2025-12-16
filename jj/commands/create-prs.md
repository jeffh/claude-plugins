---
description: Create PRs for all bookmarks in a jj stack with automatic stack linking
model: claude-haiku-4-5
---

# Create Pull Requests from Stack

You are tasked with creating pull requests for all bookmarked changes in the current jj tree.

## Process:

### 1. Understand the current state

First, gather information about the repository and stack:

```bash
# Detect main branch
jj log -r 'bookmarks()' --no-graph -T 'bookmarks ++ "\n"'

# View the current stack with bookmarks
jj log -r '::@ & mine()' --no-graph

# List all bookmarks that need PRs (excluding main/master)
jj log -r 'bookmarks() ~ (main | master)' --no-graph -T 'separate(" ", change_id.short(), bookmarks, description.first_line()) ++ "\n"'
```

- Identify the primary branch (`main` or `master`)
- Identify bookmarks that represent changes needing PRs
- Understand the parent-child relationships between commits
- Count how many PRs will be created

### 2. Check for existing PRs

Before creating PRs, check what already exists:

```bash
gh pr list --json number,title,headRefName,url,baseRefName --state open
```

- Map existing PRs to their bookmarks
- Note which bookmarks need new PRs vs updates
- Identify any PRs that may need their base branch updated

### 3. Ask about PR configuration

Present the user with configuration options based on what you found:

**For stack structure:** (only ask if more than one PR)
- "Stacked PRs (each PR based on parent bookmark)" - Recommended for related changes that build on each other
- "Independent PRs (all PRs based on main)" - Better for unrelated changes

**For PR state:**
- "Create as drafts" - Recommended for work in progress
- "Publish immediately" - For ready-to-review changes

Provide sensible defaults:
- Default to stacked PRs if commits have clear parent-child relationships
- Default to drafts if any commit message contains "WIP", "wip", or "draft"

### 4. Push branches to origin

```bash
jj git push --allow-new
```

- Parse output to confirm which bookmarks were pushed
- Note any failures and report them

### 5. Create or update PRs for each bookmark

For each bookmark (in order from closest to main to furthest):

**If PR doesn't exist:**
1. Get the commit details:
   ```bash
   jj show --no-pager -r '<bookmark>' --no-graph -T 'description'
   jj diff --no-pager -r '<bookmark>'
   ```
2. Generate PR title from first line of commit description
3. Generate PR body:
   - Use the full commit description as the starting point
   - Add context about what changed and why
   - **Do NOT include Claude attribution or co-author info**
4. Determine base branch:
   - Stacked mode: Use parent bookmark, or main if first in stack
   - Independent mode: Use main/master
5. Create the PR:
   ```bash
   # For drafts:
   gh pr create --draft --head <bookmark> --base <base-branch> --title "<title>" --body "<body>"
   # For published:
   gh pr create --head <bookmark> --base <base-branch> --title "<title>" --body "<body>"
   ```

**If PR already exists:**
1. Check if base branch needs updating (for stacked PRs)
2. Update if necessary:
   ```bash
   gh pr edit <number> --base <correct-base>
   ```

Store the PR URL, number, and bookmark for stack linking.

### 6. Update all PR descriptions with stack links

For each PR in the stack:
1. Fetch current PR body:
   ```bash
   gh pr view <number> --json body -q '.body'
   ```
2. Remove any existing "Stack:" section
3. Build the new stack section showing all PRs in order (closest to main first)
4. Add/update the stack section at the end of the body
5. Update the PR:
   ```bash
   gh pr edit <number> --body "<updated-body>"
   ```

Stack format:
```md

---

**Stack:**
- #123 - Feature setup ← base
- #124 - Core implementation ← **this PR**
- #125 - Tests and documentation
```

### 7. Generate summary

Present a summary table:

| Bookmark | PR | Base | Status |
|----------|-----|------|--------|
| feature-setup | #123 | main | Created |
| feature-core | #124 | feature-setup | Created |
| feature-tests | #125 | feature-core | Updated |

Include:
- Links to all PRs created/updated
- Any errors encountered
- Next steps (e.g., "Mark PRs as ready for review when complete")

## Important:

- **NEVER add co-author information or Claude attribution**
- PRs should be authored solely by the user
- Do not include any "Generated with Claude" messages
- Do not add "Co-Authored-By" lines
- Write PR descriptions in the user's voice

## Jujutsu-specific notes:

- `jj git push --allow-new` pushes all bookmarks and shows which are new
- `jj log --no-pager -r 'ancestors(@, N)'` shows N ancestors of current revision
- `jj log --no-pager -r 'bookmarks() ~ main'` shows all bookmarks except main
- `jj show --no-pager -r <rev> -T 'description'` gets the full commit message
- Use `jj log -r '<bookmark>-'` to find the parent of a bookmark
- Bookmark names become branch names when pushed

## GitHub CLI notes:

- `gh pr create --head <branch>` specifies the head branch
- `gh pr create --base <branch>` specifies the base branch
- `gh pr list --json` returns structured data for parsing
- `gh pr edit <number>` updates an existing PR
- `gh pr view <number> --json body` gets just the PR body

## Error handling:

- If push fails, report the error and stop
- If PR creation fails for a bookmark, report it but continue with others
- If a PR already exists for a bookmark, update it instead of failing
- If PR description update fails, report it but continue with other PRs
- At the end, summarize any errors encountered

## Remember:

- The stack visualization helps reviewers understand dependencies
- Stacked PRs allow granular review but require merging in order
- Independent PRs are simpler but may have larger diffs and conflicts
- Each PR description should make sense on its own
- Update existing PRs rather than creating duplicates
- The user may run this command multiple times as they iterate
