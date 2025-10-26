# JJ Plugin

**Category:** Development
**Version:** 2025-10-12
**Author:** Jeff Hui (jeff@jeffhui.net)

Jujutsu (jj) version control commands for Claude Code. This plugin provides workflow commands specifically designed for developers using Jujutsu VCS, offering streamlined commit management, rebasing, and pull request creation.

## Commands

The jj plugin provides 3 slash commands for Jujutsu workflows:

### `/commit`

Creates jj commits for changes made during your session.

**Features:**
- Supports both git and Jujutsu version control systems
- Groups related changes logically into atomic commits
- Follows repository commit message conventions
- Never adds Claude attribution or co-author information
- Presents commit plan before execution
- Uses `jj describe` for commit messages
- Supports `jj split` for creating multiple logical commits

**Usage:**
```bash
/commit
```

**Jujutsu-specific behavior:**
- Automatically tracks all changes in the working copy
- Uses `jj describe` to set commit messages
- Can use `jj split` to separate changes into multiple commits
- Updates working copy revision automatically

---

### `/rebase`

Rebases the current changeset onto the primary branch.

**Features:**
- Automatically detects primary branch (main or master)
- Fetches latest changes before rebasing
- Handles the entire changeset chain
- Reports conflicts clearly if they occur
- Shows updated commit tree after completion

**Usage:**
```bash
/rebase
```

**Process:**
1. Determines primary branch (main or master)
2. Fetches latest changes with `jj git fetch`
3. Identifies current changeset
4. Rebases current changeset and descendants onto primary branch
5. Displays updated commit tree

**Important:**
- Does not rebase changesets that are part of bookmarks you plan to delete
- Only rebases the current changeset chain, not other branches
- Stops and reports if conflicts are encountered

---

### `/create_prs`

Creates pull requests for all changes in the current jj tree, including stack visualization.

**Features:**
- Creates PRs for entire jj changeset stack
- Supports both draft and published PRs
- Configurable base branch strategy (main-based or parent-based)
- Automatically generates descriptive PR titles and bodies
- Updates all PR descriptions with stack visualization
- Shows which PR corresponds to which bookmark
- Never adds Claude attribution or co-author information

**Usage:**
```bash
/create_prs
```

**Interactive prompts:**
- Choose between main-branch-based or parent-based PRs
- Choose between draft or published PRs

**Stack visualization example:**
```md
Stack:
 - https://github.com/org/repo/pull/123
 - https://github.com/org/repo/pull/124 <-- This PR
 - https://github.com/org/repo/pull/125
```

**Process:**
1. Asks about PR configuration preferences
2. Pushes all branches to remote
3. Creates PRs with descriptive titles and bodies
4. Adds stack visualization to all PR descriptions
5. Generates summary table of created PRs

---

## Requirements

### Jujutsu VCS

This plugin requires Jujutsu to be installed and configured:

```bash
# Install jujutsu
brew install jj  # macOS
# or see https://github.com/martinvonz/jj for other platforms
```

### GitHub CLI

The `/create_prs` command requires the GitHub CLI:

```bash
# Install GitHub CLI
brew install gh  # macOS
# or see https://cli.github.com/ for other platforms

# Authenticate
gh auth login
```

## Jujutsu Concepts

For developers new to Jujutsu:

- **Changesets**: Jujutsu works with changesets instead of commits. Each change is automatically tracked.
- **Bookmarks**: Similar to Git branches, but more flexible.
- **Working copy**: Represented by `@` in logs, automatically updated by operations.
- **Revisions**: Can be referenced by ID or expressions like `@` (current working copy) or `@-` (parent).

## Comparison with Git

If you're familiar with Git:

- `jj describe` ≈ `git commit`
- `jj split` ≈ `git add -p` + multiple commits
- `jj rebase` ≈ `git rebase`
- `jj git fetch` ≈ `git fetch`
- `jj log` ≈ `git log --graph`
