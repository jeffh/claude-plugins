# Create Bookmarks

You are tasked with creating bookmarks for commits in the current jj tree.

## Process:

1. **Ask configuration questions:**
   - Ask the user: "What prefix should be used for bookmarks?" with options:
     - Default: `$(gh api user | jq -r .login)/` (run this command to get the actual default value)
     - Custom: Let the user specify a custom prefix
   - Ask the user: "Should I create a bookmark on the current commit only, or also create bookmarks on previous commits based on logical groupings of changes?" (current only / create multiple bookmarks)
   - Wait for user responses before proceeding

2. **Check for commits without descriptions:**
   - Run `jj log -r ::@ --no-graph -T 'separate(" ", change_id.short(), description.first_line())'` to list commits from the current location to the root
   - Identify commits with empty or placeholder descriptions
   - If commits without descriptions are found, ask: "I found commits without descriptions. Should I add descriptions to these commits?" (yes/no)

3. **Add descriptions if requested:**
   - For each commit without a description:
     - Run `jj diff -r <revset>` to see the changes
     - Analyze the changes and draft a clear commit message
     - Use `jj describe -r <revset> -m "<message>"` to add the commit message
     - Use imperative mood in commit messages
     - Focus on what the changes accomplish, not just what files changed

4. **Determine bookmark locations:**
   - If user chose "current only":
     - Create a single bookmark on the current commit (@)
     - Ask the user for the bookmark name (the part after the prefix)
   - If user chose "create multiple bookmarks":
     - Run `jj log` to visualize the commit tree from current to main
     - Analyze the commits to identify logical groupings:
       - Look for related file changes
       - Look for commits that accomplish a single feature or fix
       - Look for natural breakpoints between different types of work
     - Present your analysis to the user:
       - Show which commits you plan to group together
       - Suggest bookmark names for each group
       - Ask: "I plan to create [N] bookmarks with these groupings. Shall I proceed?" (yes/no)

5. **Create bookmarks:**
   - For each bookmark to be created:
     - Use `jj bookmark create <bookmark-prefix><bookmark-name> -r <revset>`
     - The revset should target the specific commit (e.g., `@`, `@-`, `@--`, or a change_id)
     - If creating multiple bookmarks, work from oldest to newest
   - Show the result with `jj log` to visualize the new bookmarks

6. **Generate summary:**
   - List all bookmarks created with their corresponding commits
   - Show the command to push these bookmarks: `jj git push --bookmark <bookmark-name>`
   - Note: The user will need to push bookmarks manually when ready

## Important:

- **Bookmark naming:**
  - Use descriptive names that explain what the changes accomplish
  - Use kebab-case for multi-word names (e.g., `fix-login-bug`)
  - Keep names concise but meaningful

- **Commit descriptions:**
  - Never add co-author information or Claude attribution
  - Write commit messages as if the user wrote them
  - Use imperative mood (e.g., "Add feature" not "Added feature")
  - Focus on why the changes were made, not just what

- **Logical groupings:**
  - Group commits that work together toward a single goal
  - Consider whether commits should be reviewed together
  - Think about what would make sense as a single PR
  - Respect natural boundaries between features/fixes

## Jujutsu-specific notes:

- Use `jj bookmark create <name> -r <revset>` to create bookmarks
- Revsets can target specific commits: `@` (current), `@-` (parent), change IDs
- Use `jj log -r ::@` to see commits from current to root
- Use `jj log -r @..main` to see commits between current and main (if applicable)
- Use `jj diff -r <revset>` to see changes in a specific commit
- Use `jj describe -r <revset> -m "message"` to set commit descriptions
- Bookmarks are local until pushed with `jj git push --bookmark <name>`

## Remember:

- You have the full context of the commit history
- Ask clarifying questions if the logical groupings aren't obvious
- The user trusts your judgment on groupings, but present your plan first
- Clear bookmark names help with organization and PR creation later
