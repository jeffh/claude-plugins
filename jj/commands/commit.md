---
description: Create jj changes with user approval and no Claude attribution
argument-hint: "[revset]"
model: claude-haiku-4-5
tools: Bash(jj status:*), Bash(jj diff:*), Bash(jj log:*), Bash(jj describe:*), Bash(jj split:*), Bash(jj new:*)
---

# Commit Changes with Jujutsu

Create jj change descriptions for work done during this session. Write commit messages as if the user wrote them. NEVER add co-author information or Claude attribution.

## Usage

- `/jj:commit` - Describe the working copy (`@`) and any undescribed parent commits
- `/jj:commit <revset>` - Describe only the specified revision(s), without splitting or modifying other commits

## Process

### 1. Analyze Changes

```bash
jj status --no-pager
jj diff --no-pager
jj log --no-pager -r 'trunk()..@ & description(exact:"")' -T 'change_id ++ "\n"'
```

Run `jj diff --no-pager -r '<change_id>'` for each undescribed commit, including parents.

If a revset was provided, use `jj log --no-pager -r '<revset>'` and diff each commit instead.

### 2. Write Commit Messages

**Format:**
```
<type>: <subject>

[optional body]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `build`

**Rules:**
- Subject: imperative mood, lowercase, no period, max 50 chars
- Body: wrap at 72 chars, explain WHY not just WHAT
- Group related changes logically
- Keep changes focused and atomic

### 3. Apply Descriptions

```bash
jj describe -m "message"              # current change
jj describe -r <change_id> -m "msg"   # specific revision
```

**To split into multiple changes** (only when no revset provided):
```bash
jj split -m "first message" path/to/files/
jj split -m "second message" more/files/
jj describe -m "remaining changes"
```

### 4. Show Results

```bash
jj log --no-pager -r 'ancestors(@, 5)'
```
