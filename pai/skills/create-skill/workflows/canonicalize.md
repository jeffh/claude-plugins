# Canonicalize Skill Workflow

Fix skill structure to canonical form. Handles legacy formats and migrations.

## Procedure

### Step 1: Identify Skill

Determine which skill to canonicalize:
- User may specify by name or path
- User may reference current context
- If ambiguous, list available skills and ask

### Step 2: Analyze Current State

Read and document:
- All files in skill directory
- Current directory structure
- SKILL.md content (if exists)
- Any legacy patterns

Report findings to user before making changes.

### Step 3: Plan Fixes

Identify all issues that need fixing:

**Structural Fixes:**
- [ ] Rename SKILL.md to uppercase if lowercase
- [ ] Rename files to kebab-case
- [ ] Rename directory to kebab-case
- [ ] Move workflows to `workflows/` subdirectory
- [ ] Move reference docs to skill root
- [ ] Remove empty/orphaned files

**Frontmatter Fixes:**
- [ ] Add missing `---` delimiters
- [ ] Add missing `name` field
- [ ] Add missing `description` field
- [ ] Fix `name` to be kebab-case
- [ ] Convert multi-line description to single line

**Content Fixes:**
- [ ] Add title header matching name
- [ ] Add USE WHEN clause to description
- [ ] Add Examples section with stubs
- [ ] Add workflow routing table (if workflows exist)
- [ ] Link unlinked files from SKILL.md

**Legacy Migration:**
- [ ] Convert old format to current spec
- [ ] Consolidate scattered config files
- [ ] Update deprecated field names

Present plan to user and confirm before proceeding.

### Step 4: Apply Fixes

For each fix, report what's being done:

**File Renames:**
```
Renaming: skill.md → SKILL.md
Renaming: Create.md → create.md
Renaming: Update_Info.md → update-info.md
```

**Directory Restructure:**
```
Moving: create.md → workflows/create.md
Moving: update.md → workflows/update.md
Creating: workflows/ directory
```

**Frontmatter Updates:**
```
Adding: name: skill-name
Fixing: description to single line
Adding: USE WHEN clause
```

**Content Updates:**
```
Adding: # skill-name header
Adding: ## Examples section (stub)
Adding: workflow routing table
```

### Step 5: Handle Conflicts

If issues arise:
- **Duplicate names after kebab-case**: Ask user which to keep
- **Missing required info**: Ask user to provide
- **Ambiguous file purpose**: Ask user to classify

### Step 6: Validate

Run validate workflow on canonicalized skill:
- All structural errors should be resolved
- Report any remaining warnings

### Step 7: Report Changes

Summary format:

```markdown
## Canonicalization Complete

**Skill:** [name]
**Location:** [path]

### Changes Made

**Files Renamed:**
- skill.md → SKILL.md
- Create.md → create.md

**Files Moved:**
- create.md → workflows/create.md

**Files Created:**
- workflows/ (directory)

**Content Updated:**
- Added name field
- Added USE WHEN clause
- Added Examples section (stub)

### Before/After Structure

Before:
```
my-skill/
├── skill.md
├── Create.md
└── Reference_Doc.md
```

After:
```
my-skill/
├── SKILL.md
├── reference-doc.md
└── workflows/
    └── create.md
```

### Validation Status
✅ All errors resolved
⚠️ 1 warning: Examples section needs content

### Next Steps
1. Fill in Examples section with real usage patterns
2. Restart Claude Code to reload skill
```

## Common Legacy Patterns

### Pattern 1: Lowercase SKILL.md
```
Before: skill.md
Fix: Rename to SKILL.md
```

### Pattern 2: Underscore/CamelCase Files
```
Before: Create_Workflow.md, updateInfo.md
Fix: create-workflow.md, update-info.md
```

### Pattern 3: Flat Structure (No workflows/)
```
Before: skill.md, create.md, update.md (all at root)
Fix: Move create.md, update.md to workflows/
```

### Pattern 4: Missing Frontmatter
```
Before: Just markdown content, no ---
Fix: Add frontmatter with name and description
```

### Pattern 5: Multi-line Description
```
Before: description: |
          Multi-line
          text here
Fix: Single line with USE WHEN
```

### Pattern 6: Missing USE WHEN
```
Before: description: Does code review
Fix: description: Does code review. USE WHEN user wants PR reviewed.
```

## Example Run

```
User: Fix my broken code-review skill

Claude: Analyzing ~/.claude/skills/code-review/...

Current structure:
code-review/
├── skill.md (lowercase!)
├── Create.md (wrong case)
└── Reference_Doc.md (underscores)

Issues found:
1. skill.md should be SKILL.md
2. Create.md should be create.md in workflows/
3. Reference_Doc.md should be reference-doc.md
4. Missing USE WHEN in description
5. Missing Examples section

Proceed with fixes? [Y/n]

User: Y

Claude: Applying fixes...
✅ Renamed skill.md → SKILL.md
✅ Created workflows/ directory
✅ Moved Create.md → workflows/create.md
✅ Renamed Reference_Doc.md → reference-doc.md
✅ Added USE WHEN clause
✅ Added Examples section (stub)

Validation: All errors resolved, 1 warning (fill in examples)

Restart Claude Code to reload the skill.
```
