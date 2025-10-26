# Rebase Current Changeset

You are tasked with rebasing the current changeset onto the primary branch.

## Process:

1. **Determine the primary branch:**
   - Run `jj log -r 'bookmarks()' --no-graph` to list all bookmarks
   - Check if `main` or `master` exists in the bookmark list
   - If `main` exists, use it as the primary branch
   - If `main` doesn't exist but `master` does, use `master` as the primary branch
   - If neither exists, ask the user: "What is the name of your primary branch?"
   - Wait for the user's response before proceeding

2. **Pull latest changes:**
   - Run `jj git fetch` to fetch the latest changes from the remote
   - This ensures we're rebasing onto the latest version of the primary branch

3. **Identify the changeset to rebase:**
   - Run `jj log -r 'mine() & ::@'` to see the current changeset and its ancestors
   - The current changeset is marked with `@` in the log
   - Identify the changeset ID of the current working copy (the one with `@`)

4. **Rebase the changeset:**
   - Run `jj rebase -s <changeset-id> -d <primary-branch>`
   - Where `<changeset-id>` is the ID of the current working copy
   - Where `<primary-branch>` is the primary branch determined in step 1
   - This rebases the current changeset and all its descendants onto the primary branch

5. **Show the result:**
   - Run `jj log` to display the updated commit tree
   - Confirm to the user that the rebase was successful

## Important:

- **DO NOT rebase changesets that are part of bookmarks you plan to delete**
- Only rebase the current changeset chain, not other branches
- If there are conflicts during rebase, report them to the user and stop
- Use `jj git fetch` instead of `jj git pull` to avoid automatic merging

## Jujutsu-specific notes:

- `jj rebase -s <source> -d <destination>` rebases the source changeset and all its descendants
- The `-s` flag specifies the source changeset to rebase
- The `-d` flag specifies the destination to rebase onto
- Jujutsu handles rebasing automatically, updating the working copy
- Use changeset IDs or revision expressions (like `@` for current working copy)

## Error handling:

- If `jj git fetch` fails, report the error and stop
- If the primary branch doesn't exist locally, report this and ask the user to verify
- If rebase fails due to conflicts, report the conflicts and provide guidance
- If the user is not on a changeset that can be rebased, explain why

## Remember:

- Rebasing updates the working copy to be based on the latest primary branch
- This is useful before creating pull requests or pushing changes
- The user trusts your judgment to identify the correct changeset to rebase
