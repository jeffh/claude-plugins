---
description: Create jj changes with user approval and no Claude attribution
model: claude-haiku-4-5
---

# Commit Changes with Jujutsu

You are tasked with creating jj changes for the work done during this session.

## Process

### 1. Understand What Changed

- Review the conversation history to understand what was accomplished
- Run `jj status` to see modified files
- Run `jj diff` to review the actual changes
- Determine if changes should be one change or split into multiple logical changes

### 2. Plan Your Change(s)

Draft clear, descriptive commit messages following these guidelines:

**Format:**
```
<type>: <subject>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`

**Rules:**
- Subject line: imperative mood, lowercase, no period, max 50 chars
- Body: wrap at 72 chars, explain WHY not just WHAT
- Focus on the user's intent, not implementation details

**Examples:**
- `feat: add dark mode toggle to settings`
- `fix: prevent crash when config file is missing`
- `refactor: extract validation logic into separate module`

### 3. Present Your Plan

Show the user:
- Which files are included in each change
- The proposed commit message(s)
- Ask: "I plan to create [N] change(s). Shall I proceed?"

### 4. Execute Upon Confirmation

**For a single change:**
```bash
jj describe -m "your commit message"
```

**For multiple changes** (split by file paths):
```bash
# Split specific files into first change with message
jj split -m "first change message" path/to/file1 path/to/dir/

# Describe the remaining change (now in @)
jj describe -m "second change message"
```

For three or more changes, chain splits:
```bash
jj split -m "first message" files-for-first-change/
jj split -m "second message" files-for-second-change/
jj describe -m "third message"
```

**Show results:**
```bash
jj log -r 'ancestors(@, 5)'
```

## Important Rules

- **NEVER add co-author information or Claude attribution**
- Commits should be authored solely by the user
- Do not include "Generated with Claude" or "Co-Authored-By" lines
- Write commit messages as if the user wrote them

## Jujutsu Concepts

- **Automatic tracking**: All file changes are automatically tracked in the working copy change (@)
- **No staging**: Unlike git, there's no staging area - `jj describe` sets the message directly
- **Working copy is a change**: The @ revision always represents uncommitted work
- **`jj new`**: Creates a new empty change on top of the current one (use after describing to start fresh)
- **`jj split -m "msg" paths`**: Non-interactively splits specified paths into a new change with the given message
- **`jj squash`**: Combines the current change into its parent

## Common Patterns

**Describe current work and start fresh:**
```bash
jj describe -m "message"
jj new
```

**View recent changes:**
```bash
jj log -r 'ancestors(@, 10)'
```

**Check what will be committed:**
```bash
jj diff -r @
```

## Remember

- You have full context of what was done this session
- Group related changes together logically
- Keep changes focused and atomic
- The user trusts your judgment - they asked you to commit
