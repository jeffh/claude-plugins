---
description: Import and adapt humanlayer commands and agents from source repository
---

# Import HumanLayer Commands and Agents

You are tasked with importing humanlayer commands and agents from a source repository and adapting them for use in this repository.

## Input

The user will provide a path to the humanlayer repository as an argument to this command.

## Process

### Step 1: Validate Input Path

1. Check that the provided path exists and is a directory
2. Verify that the path contains `.claude/commands/` and `.claude/agents/` directories
3. If validation fails, report the error and stop

### Step 2: Copy Files

1. Copy all files from `<humanlayer_repo>/.claude/commands/` to `humanlayer/commands/`
2. Copy all files from `<humanlayer_repo>/.claude/agents/` to `humanlayer/agents/`
3. Use `cp -r` to preserve file attributes
4. Report which files were copied

### Step 3: Remove Syncing Functionality

For each copied file (both commands and agents):

1. Read the file content
2. Remove all references to syncing functionality:
   - Remove any usage of `thoughts sync` commands
   - Remove any sync-related instructions or steps
   - Remove any references to syncing thoughts directory
   - Remove any sync verification steps
3. If a file is modified, write the updated content back
4. Report which files were modified and what was removed

### Step 4: Convert Script References to Skills

For each copied file (both commands and agents):

1. Search for references to scripts in `scripts/*` and `hack/*` directory
2. For each script reference found:
   - Read the script content from the source repository
   - Create a new skill directory in `humanlayer/skills/` with a descriptive name based on the script's purpose
   - Create a `SKILL.md` file inside the skill directory with proper frontmatter:
     ```yaml
     ---
     name: script-name
     description: What this skill does and when Claude should activate it
     allowed-tools: Bash, Read
     ---
     ```
   - Convert the script's functionality into skill instructions within `SKILL.md`
   - If the script uses git-specific commands, include both git and jj (Jujutsu) equivalents in the skill instructions:
     ```
     For git users:
     - <git command>

     For jj users:
     - <jj equivalent>
     ```
   - Replace the script reference in the original file with instructions to use the Skill tool
3. Report which skills were created and which script references were replaced

**Skill directory structure:**
```
humanlayer/skills/
  skill-name/
    SKILL.md
```

**Skill frontmatter requirements:**
- `name`: lowercase, numbers, hyphens only (max 64 chars)
- `description`: explains both what the skill does AND when it should be activated (max 1024 chars)
- `allowed-tools` (optional): comma-separated list of tools the skill can use

### Step 5: Git/JJ Dual Support

For any agents that involve version control operations:

1. Identify git-specific commands (e.g., `git status`, `git commit`, `git branch`)
2. Add equivalent jj commands alongside git commands
3. Structure the instructions to support both workflows:
   ```
   For git users:
   - <git command>

   For jj users:
   - <jj equivalent>
   ```
4. Common conversions:
   - `git status` → `jj status`
   - `git branch` → `jj bookmark list`
   - `git commit` → `jj describe`
   - `git push` → `jj git push`
   - `git log` → `jj log`
   - `git diff` → `jj diff`

### Step 6: Validation

1. Verify that all copied files are valid markdown
2. Verify that all agent files have proper frontmatter with `name`, `description`, `tools`, and `model` fields
3. Verify that all skill directories contain a valid `SKILL.md` with `name`, `description`, and optionally `allowed-tools` fields
4. Check that no references to `thoughts sync` remain in any files
5. Report any validation issues found

### Step 7: Summary Report

Provide a comprehensive summary including:
- Number of commands copied
- Number of agents copied
- Number of files modified to remove syncing
- Number of new skills created from scripts
- List of all script-to-skill conversions
- Any validation warnings or errors

## Example Usage

```
/import-humanlayer /path/to/humanlayer-repo
```

## Notes

- This is a destructive operation that will overwrite existing files in `humanlayer/commands/`, `humanlayer/agents/`, and `humanlayer/skills/`
- Always backup or commit existing work before running this command
- The command should be thorough and report all changes made
- When in doubt about how to convert a script to a skill, create a skill that provides clear documentation in SKILL.md for Claude to follow
