---
description: Commit, create bookmarks, push, and create PRs in one workflow
model: claude-haiku-4-5
---

# Commit, Push, and Create PRs

You are tasked with executing the complete workflow from uncommitted changes to open pull requests.

This command orchestrates three separate operations in sequence:
1. **Commit** - Describe changes with proper commit messages (`/jj:commit`)
2. **Bookmark** - Create bookmarks for the stack (`/jj:create-bookmarks`)
3. **Push & PR** - Push to origin and create/update pull requests (`/jj:create-prs`)

## Process

### Phase 1: Assess Current State

Gather initial information to determine what needs to be done:

```bash
# View current working copy status
jj status --no-pager

# View the current stack
jj log --no-pager -r 'trunk()..@'

# List commits with descriptions and bookmarks
jj log -r 'trunk()..@' --no-graph -T 'separate(" | ", change_id.short(), if(description, description.first_line(), "(no description)"), bookmarks) ++ "\n"'
```

Identify:
- Whether there are uncommitted changes that need descriptions
- Which commits already have bookmarks
- Which bookmarks might already have PRs

### Phase 2: Plan and Confirm

Present a summary:

```
Current state:
- [N] commits in stack (trunk()..@)
- [X] commits need descriptions
- [Y] commits need bookmarks
- [Z] PRs to create/update

Workflow:
1. Add descriptions to commits (if needed)
2. Create bookmarks (if needed)
3. Push and create PRs

Proceed?
```

Wait for user confirmation before proceeding.

### Phase 3: Execute Workflow

Execute each phase in sequence, invoking the appropriate slash command:

**Step 1: Commit (if commits need descriptions)**

Invoke `/jj:commit` with the appropriate revset for commits that need descriptions.

Wait for commit phase to complete before proceeding.

**Step 2: Create Bookmarks (if commits need bookmarks)**

Invoke `/jj:create-bookmarks` to create bookmarks for the stack.

Wait for bookmark creation to complete before proceeding.

**Step 3: Create PRs**

Invoke `/jj:create-prs` to push branches and create pull requests.

### Phase 4: Summary

After all phases complete, present a final summary:

```
Workflow complete!

Commits described: [list]
Bookmarks created: [list]
PRs created/updated: [list with URLs]

All changes are now in open pull requests.
```

## Skip Conditions

- **Skip commit phase** if all commits already have descriptions
- **Skip bookmark phase** if all commits already have bookmarks
- **Skip PR phase** if user declines to create PRs

## Important Rules

- **NEVER add co-author information or Claude attribution**
- Commits and PRs should be authored solely by the user
- Each phase should complete fully before proceeding to the next
- If any phase fails, report the error and ask how to proceed

## Error Handling

**No changes to commit:**
- If working copy is empty and no commits in stack, inform user

**trunk() not configured:**
- Fall back to `main@origin` or `master@origin`

**Phase failure:**
- Report which phase failed and the specific error
- Ask user if they want to retry or skip that phase

## Remember

- This is a streamlined workflow - minimize questions
- Use sensible defaults based on context
- The user trusts your judgment
- Each sub-command handles its own user interactions
- Focus on orchestration, not reimplementing the sub-commands
