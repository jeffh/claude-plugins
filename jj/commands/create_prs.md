# Create Pull Requests from Stack

You are tasked with creating pull requests for all changes in the current jj tree.

## Process:

1. **Ask about PR configuration:**
   - Ask the user: "Should all PRs be based on the main branch, or should each PR be based on its direct parent branch?"
   - Ask the user: "Should the PRs be created as drafts or published immediately?"
   - Wait for user responses before proceeding

2. **Understand the current state:**
   - Run `jj log` to visualize the current commit tree
   - Identify which commits need PRs
   - Understand the branch structure and relationships

3. **Push branches to origin:**
   - Run `jj git push --allow-new` to push all branches
   - Parse the output to identify which branches were pushed
   - Track the branch names and their corresponding commits

4. **Create PRs for each new branch:**
   - For each new branch that was pushed:
     - Determine the commit range for changes (use `jj log` and `jj diff`)
     - Generate a clear, descriptive PR title based on the commit message(s)
     - Create a PR body that describes the changes:
       - Summarize what changed and why
       - Include relevant context about the implementation
       - Do NOT include Claude attribution or co-author information
     - Determine the base branch:
       - If user chose "main branch": use main (or master)
       - If user chose "parent branch": use the direct parent commit's branch
     - Create the PR:
       - If user chose "drafts": Run `gh pr create --draft --base <base-branch> --head <branch-name> --title "<title>" --body "<body>"`
       - If user chose "published": Run `gh pr create --base <base-branch> --head <branch-name> --title "<title>" --body "<body>"`
     - Store the PR URL and branch name for later use

5. **Build the stack information:**
   - Determine the order of PRs from closest to main to furthest
   - For each PR, identify its position in the stack

6. **Update all PR descriptions with stack links:**
   - For each PR created:
     - Build the stack section showing all PRs in order
     - Mark the current PR with `<-- This PR`
     - Use `gh pr edit <PR-URL> --body "<updated-body>"` to add the stack section
   - Stack format:
     ```md
     Stack:
      - https://github.com/<org>/<project>/pull/<id>
      - https://github.com/<org>/<project>/pull/<id2> <-- This PR
      - https://github.com/<org>/<project>/pull/<id3>
     ```

7. **Generate summary:**
   - Create a summary table showing:
     - Bookmark/branch name
     - Corresponding PR URL
     - Base branch
   - Present this to the user

## Important:

- **NEVER add co-author information or Claude attribution**
- PRs should be authored solely by the user
- Do not include any "Generated with Claude" messages
- Do not add "Co-Authored-By" lines
- Write PR descriptions in the user's voice

## Jujutsu and GitHub CLI notes:

- `jj git push --allow-new` will push all branches and output which ones are new
- Use `jj log -r 'branches()'` to see all branches
- Use `jj diff -r <revision>` to see changes for a specific commit
- Use `gh pr create` to create PRs programmatically
- Use `gh pr edit` to update PR descriptions after creation
- Use `gh pr list --json url,number,headRefName` to query existing PRs if needed

## Error handling:

- If push fails, report the error and stop
- If PR creation fails for a branch, report it but continue with other branches
- If PR description update fails, report it but continue with other PRs
- At the end, report any errors encountered

## Remember:

- The stack visualization helps reviewers understand dependencies
- PRs based on parent branches create a more granular review process
- PRs based on main are simpler but may have larger diffs
- Each PR should stand alone in its description despite being part of a stack
