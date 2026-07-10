# JJ Plugin

**Category:** Development
**Version:** 2026-07-09
**Author:** Jeff Hui (jeff@jeffhui.net)

Jujutsu (jj) version control workflows for Claude Code. This plugin provides streamlined commit management, rebasing, and pull request creation for developers using Jujutsu VCS.

## Architecture: thin commands + skills

Each workflow is a **hybrid command + skill** pair:

- **Thin slash command** (`jj/commands/<name>.md`) — a `## Context` block that front-loads every read-only command using the auto-executing `` !`…` `` bash syntax, so the full picture (status, diff, log, templates) is in context *before* any message is written. It then hands off to the matching skill.
- **Skill** (`jj/skills/<name>/SKILL.md`) — owns the workflow logic and decisions. Skills carry a third-person, trigger-rich description so Claude can invoke them by intent, and declare **no model pin** (each inherits the session model).

Because auto-executing `` !`…` `` context injection is a slash-command feature (skills can't run it), each skill also carries a fallback: if the pre-gathered context is absent, it gathers the same context itself before proceeding.

Skills are invoked as `jj:commit`, `jj:commit-push-pr`, and `jj:rebase`.

## Commands & skills

### `/jj:commit` → skill `jj:commit`

Describe jj changes made during your session.

**Behavior:**
- Front-loads `jj status`, `jj diff`, the undescribed-change list, recent log, and any configured commit template
- Writes conventional commit messages (`<type>: <subject>`) as if the user wrote them
- **Honors a configured commit template** (`templates.draft_commit_description` in jj, or `commit.template` in git); otherwise matches recent log style
- Groups related changes into atomic commits; supports `jj split`
- Never adds Claude attribution or co-author information
- Accepts an optional revset: `/jj:commit <revset>` describes only that revision without splitting

---

### `/jj:commit-push-pr` → skill `jj:commit-push-pr`

Run the full workflow from uncommitted changes to open pull requests: describe → bookmark → push → PR.

**Behavior:**
- Front-loads GitHub user, remotes, stack log, open PRs, and any repo PR template
- Delegates describing to the `jj:commit` skill
- Creates one bookmark per commit (prefix `<github-username>/`) and one stacked PR per bookmark
- **Honors a GitHub PR template** (`.github/PULL_REQUEST_TEMPLATE.md` and common variants) when present, filling out its sections; otherwise writes a concise body with no "Test plan" section
- Never adds Claude attribution or co-author information

---

### `/jj:rebase` → skill `jj:rebase`

Rebase the current changeset stack onto the latest trunk.

**Behavior:**
- Front-loads `jj git fetch` and the stack root
- Rebases the entire stack (root through `@`) onto `trunk()`
- Falls back to `main@origin` / `master@origin` when `trunk()` is not configured
- Reports conflicts clearly and stops — never auto-resolves
- Reports "already up to date" when the stack is already on trunk

## Requirements

### Jujutsu VCS

```bash
brew install jj  # macOS; see https://github.com/martinvonz/jj for other platforms
```

### GitHub CLI

Required by `/jj:commit-push-pr`:

```bash
brew install gh  # macOS; see https://cli.github.com/ for other platforms
gh auth login
```

## Jujutsu Concepts

For developers new to Jujutsu:

- **Changesets**: Jujutsu works with changesets instead of commits. Each change is automatically tracked.
- **Bookmarks**: Similar to Git branches, but more flexible.
- **Working copy**: Represented by `@` in logs, automatically updated by operations.
- **Revisions**: Referenced by ID or expressions like `@` (current working copy) or `@-` (parent).

## Comparison with Git

- `jj describe` ≈ `git commit`
- `jj split` ≈ `git add -p` + multiple commits
- `jj rebase` ≈ `git rebase`
- `jj git fetch` ≈ `git fetch`
- `jj log` ≈ `git log --graph`
