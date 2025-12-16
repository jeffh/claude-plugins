---
description: Commit, create bookmarks, push, and create PRs in one workflow
model: claude-haiku-4-5
---

# Commit, Push, and Create PRs

You are tasked with executing the complete workflow from uncommitted changes to open pull requests.

This command combines three operations:
1. **Commit** - Describe changes with proper commit messages
2. **Bookmark** - Create bookmarks for the stack
3. **Push & PR** - Push to origin and create/update pull requests

## Process

### Phase 1: Understand Current State

Gather all necessary information upfront:

```bash
# Get GitHub username for bookmark prefix
gh api user -q '.login'

# View current working copy status
jj status --no-pager

# View the current stack
jj log --no-pager -r 'trunk()..@'

# List commits with descriptions and bookmarks
jj log -r 'trunk()..@' --no-graph -T 'separate(" | ", change_id.short(), if(description, description.first_line(), "(no description)"), bookmarks) ++ "\n"'

# Check for existing PRs
gh pr list --json number,title,headRefName,url,baseRefName --state open
```

Identify:
- How many commits are in the stack
- Which commits need descriptions
- Which commits already have bookmarks
- Which bookmarks already have PRs
- The GitHub username for bookmark prefix

### Phase 2: Plan the Workflow

Based on what you found, present a summary:

```
Current state:
- [N] commits in stack (trunk()..@)
- [X] commits need descriptions
- [Y] commits need bookmarks
- [Z] PRs to create/update

Proposed workflow:
1. Add descriptions to [X] commits
2. Create [Y] bookmarks with prefix '<username>/'
3. Push to origin
4. Create [Z] PRs (as drafts / published)
```

Ask the user:

**Bookmark prefix:** (default: `<github-username>/`)

**PR configuration:** (only if creating new PRs)
- Stacked vs independent PRs
- Draft vs published

**Proceed?** Wait for confirmation before executing.

### Phase 3: Describe Commits

For each commit lacking a description:

1. Review the changes:
   ```bash
   jj diff --no-pager -r <change_id>
   ```

2. Draft a commit message following the format:
   ```
   <type>: <subject>

   [optional body]
   ```

   **Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`

   **Rules:**
   - Subject: imperative mood, lowercase, no period, max 50 chars
   - Body: wrap at 72 chars, explain WHY not just WHAT

3. Apply the description:
   ```bash
   jj describe -r <change_id> -m "commit message"
   ```

### Phase 4: Create Bookmarks

For each commit needing a bookmark:

1. Determine bookmark name from commit description
   - Use kebab-case
   - Keep concise but meaningful

2. Create the bookmark:
   ```bash
   jj bookmark create <prefix><name> -r <change_id>
   ```

Show the updated stack:
```bash
jj log --no-pager -r 'trunk()..@'
```

### Phase 5: Push to Origin

```bash
jj git push --allow-new
```

- Parse output to confirm successful push
- Report any failures

### Phase 6: Create or Update PRs

For each bookmark (in order from closest to main to furthest):

**If PR doesn't exist:**

1. Get commit details:
   ```bash
   jj show --no-pager -r '<bookmark>' -T 'description'
   ```

2. Determine base branch:
   - Stacked: parent bookmark, or main if first
   - Independent: main/master

3. Create the PR:
   ```bash
   # Draft:
   gh pr create --draft --head <bookmark> --base <base> --title "<title>" --body "<body>"
   # Published:
   gh pr create --head <bookmark> --base <base> --title "<title>" --body "<body>"
   ```

**If PR already exists:**

1. Update base branch if needed (for stacked PRs):
   ```bash
   gh pr edit <number> --base <correct-base>
   ```

### Phase 7: Add Stack Links to PRs

For each PR in a stack (more than one PR):

1. Get current body:
   ```bash
   gh pr view <number> --json body -q '.body'
   ```

2. Remove existing "Stack:" section if present

3. Add stack section:
   ```md

   ---

   **Stack:**
   - #123
   - #124 ← **this PR**
   - #125
   ```

4. Update the PR:
   ```bash
   gh pr edit <number> --body "<updated-body>"
   ```

### Phase 8: Summary

Present a complete summary:

```
Workflow complete!

Commits described: [list]
Bookmarks created: [list]

| Bookmark | PR | Base | Status |
|----------|-----|------|--------|
| feature-setup | #123 | main | Created |
| feature-core | #124 | feature-setup | Created |

Next steps:
- Review PRs at [URLs]
- Mark as ready for review when complete
```

## Important Rules

- **NEVER add co-author information or Claude attribution**
- Commits and PRs should be authored solely by the user
- Do not include "Generated with Claude" or "Co-Authored-By" lines
- Write commit messages and PR descriptions as if the user wrote them

## Error Handling

**No changes to commit:**
- If working copy is empty and no commits in stack, inform user

**trunk() not configured:**
- Fall back to `main@origin` or `master@origin`

**Bookmark already exists:**
- Report and ask for alternative name

**Push fails:**
- Report error and stop (don't create PRs without pushed code)

**PR creation fails:**
- Report error but continue with remaining PRs
- Summarize all errors at the end

## Jujutsu Concepts

- `trunk()..@` - commits between trunk and current working copy
- `jj describe -r <rev> -m "msg"` - set commit message
- `jj bookmark create <name> -r <rev>` - create bookmark
- `jj git push --allow-new` - push all bookmarks to origin
- Change IDs (short form) can be used in revsets

## GitHub CLI Notes

- `gh pr create --head <branch> --base <branch>` - create PR
- `gh pr edit <number>` - update existing PR
- `gh pr list --json` - list PRs as JSON
- `gh pr view <number> --json body` - get PR body

## Remember

- This is a streamlined workflow - minimize questions
- Use sensible defaults based on context
- Present the plan before executing
- The user trusts your judgment
- Group related changes logically
- Each PR should be reviewable on its own
