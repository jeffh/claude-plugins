---
name: commit
description: Describe jj (Jujutsu) changes with conventional commit messages written as the user, never adding Claude attribution or co-authors. This skill should be used when committing session work in a jj repo — "commit this", "describe my changes", "jj commit", or when handed pre-gathered jj status/diff context. Honors a configured commit-message template when present. Not for git repos (use the git commit flow) and not for pushing or opening PRs (use jj:commit-push-pr).
argument-hint: "[revset]"
---

# Commit Changes with Jujutsu

Write jj change descriptions for work done during this session, as if the user wrote them. NEVER add co-author information or Claude attribution.

## Usage

- Describe the working copy (`@`) and any undescribed parent commits.
- If a revset is provided, describe only the specified revision(s), without splitting or modifying other commits.

## Context expectations

When invoked from `/jj:commit`, the working-copy status, full diff, the undescribed-change list, recent log, and any configured commit template are **already in context**. Do not re-run them.

If invoked directly without that context, gather it first:

```bash
jj status --no-pager
jj diff --no-pager
jj log --no-pager -r 'trunk()..@ & description(exact:"")' -T 'change_id ++ "\n"'
```

Run `jj diff --no-pager -r '<change_id>'` for each undescribed commit, including parents. If a revset was provided, use `jj log --no-pager -r '<revset>'` and diff each commit instead.

## Honor commit templates

If a commit-message template is configured — `templates.draft_commit_description` (jj) or `commit.template` (git) — follow its structure and section headings. Otherwise, match the style of recent log messages.

## Message format

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

## Apply descriptions

```bash
jj describe -m "message"              # current change (@)
jj describe -r <change_id> -m "msg"   # specific revision
```

**To split into multiple changes** (only when no revset provided):

```bash
jj split -m "first message" path/to/files/
jj split -m "second message" more/files/
jj describe -m "remaining changes"
```

## Show results

```bash
jj log --no-pager -r 'ancestors(@, 5)'
```
