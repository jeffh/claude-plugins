---
description: Create bookmarks for commits in the current jj stack
model: claude-haiku-4-5
---

# Create Bookmarks

You are tasked with creating bookmarks for commits in the current jj stack.

## Process

### 1. Understand the current state

First, gather information about the stack:

```bash
# Get the GitHub username for default prefix
gh api user -q '.login'

# View commits in the current stack (not yet on trunk)
jj log -r 'trunk()..@'

# List commits with their descriptions (to identify missing descriptions)
jj log -r 'trunk()..@' --no-graph -T 'separate(" | ", change_id.short(), if(description, description.first_line(), "(no description)")) ++ "\n"'

# Check for existing bookmarks
jj log -r 'trunk()..@ & bookmarks()' --no-graph -T 'separate(" ", change_id.short(), bookmarks) ++ "\n"'
```

- Identify how many commits are in the stack
- Note which commits have descriptions vs. which are empty
- Identify any existing bookmarks

### 2. Ask configuration questions

Based on what you found, ask the user:

**Bookmark prefix:**
- Default: `<github-username>/` (use the username from step 1)
- Custom: Let user specify

**Bookmark scope:** (only ask if multiple commits exist)
- "Current commit only" - Single bookmark on `@`
- "Multiple bookmarks" - Create bookmarks based on logical groupings

Wait for user responses before proceeding.

### 3. Check and fix commit descriptions

If any commits lack descriptions:

1. Report which commits are missing descriptions (list their change IDs)
2. Ask: "Should I add descriptions to these commits?"

If yes, invoke `/jj:commit <revset>` with the commits that need descriptions:
- Single commit: `/jj:commit xyz`
- Multiple commits: `/jj:commit 'abc | def | ghi'`
- All in stack: `/jj:commit 'trunk()..@'`

After descriptions are added, continue to step 4.

### 4. Plan bookmark placement

**For single bookmark (current only):**
- Ask user for the bookmark name (part after prefix)
- Bookmark will be placed on `@`

**For multiple bookmarks:**
1. Analyze the commits to identify logical groupings:
   - Related file changes (same module/feature area)
   - Commits that accomplish a single goal
   - Natural breakpoints (different types of work)

2. Present your analysis:
   ```
   I found [N] commits and propose [M] bookmarks:

   Bookmark 1: <prefix>/<name>
   - <change_id>: <description>
   - <change_id>: <description>

   Bookmark 2: <prefix>/<name>
   - <change_id>: <description>
   ```

3. Ask: "Shall I proceed with these bookmarks?"

### 5. Create bookmarks

For each bookmark (work from oldest to newest in stack):

```bash
# Create the bookmark on the target commit
jj bookmark create <prefix><name> -r <change_id>
```

Then show the result:
```bash
jj log -r 'trunk()..@'
```

### 6. Generate summary

Present:
- Table of bookmarks created with their commits
- Command to push: `jj git push --allow-new`
- Remind user bookmarks are local until pushed

## Important

**Bookmark naming:**
- Use kebab-case for multi-word names (e.g., `fix-login-bug`)
- Names should describe what the changes accomplish
- Keep names concise but meaningful

**Commit descriptions:**
- NEVER add co-author information or Claude attribution
- Write commit messages as if the user wrote them
- Use imperative mood ("Add feature" not "Added feature")

**Logical groupings:**
- Group commits that work toward a single goal
- Consider what makes sense as a single PR
- Each bookmark should represent reviewable, coherent work

## Error handling

**No commits to bookmark:**
- If `trunk()..@` returns nothing, inform user there are no uncommitted changes to bookmark
- Suggest using `/jj:commit` first if there are pending changes

**trunk() not configured:**
- Fall back to checking `main@origin` or `master@origin`:
  ```bash
  jj log -r 'main@origin | master@origin' --no-graph -T 'bookmarks'
  ```
- Use whichever exists (prefer `main@origin`)

**Bookmark already exists:**
- If a bookmark name is taken, report it and ask for an alternative
- Use `jj bookmark list` to check existing names

## Edge cases

**Single commit in stack:**
- Skip the "scope" question, default to single bookmark
- Proceed directly to asking for the bookmark name

**All commits already have bookmarks:**
- Report this to the user
- Ask if they want to create additional bookmarks or update existing ones

**Empty working copy:**
- `@` may have no changes - this is normal in jj
- The most recent described commit should get the bookmark

## Jujutsu-specific notes

- `trunk()` is jj's built-in revset for the primary branch
- `trunk()..@` shows commits between trunk and current (exclusive trunk)
- `jj bookmark create <name> -r <revset>` creates a bookmark
- `jj bookmark list` shows all local bookmarks
- `jj git push --allow-new` pushes new bookmarks to remote
- Change IDs (short form like `xyz`) can be used in revsets

## Remember

- Understand the state before asking questions
- Present your plan before executing
- Bookmarks enable the `/jj:create_prs` workflow
- Clear bookmark names help with PR organization
