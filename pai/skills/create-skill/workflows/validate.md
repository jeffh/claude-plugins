# Validate Skill Workflow

Verify a Claude Code skill meets all requirements.

## Procedure

### Step 1: Identify Skill

Determine which skill to validate:
- User may specify by name or path
- User may reference current context
- If ambiguous, list available skills and ask

### Step 2: Read Skill Files

Read all files in the skill directory:
- `SKILL.md` (required)
- All files in `workflows/` (if exists)
- All files at skill root
- Note directory structure

### Step 3: Structural Validation (Must Pass)

Check each rule from [validation-rules.md](../validation-rules.md):

**S1: SKILL.md Exists**
- [ ] File `SKILL.md` exists (case-sensitive)

**S2: Valid YAML Frontmatter**
- [ ] Starts with `---` on line 1
- [ ] Ends with `---` before content
- [ ] Valid YAML syntax

**S3: Required Fields Present**
- [ ] `name` field exists and non-empty
- [ ] `description` field exists and non-empty

**S4: Name Format**
- [ ] Name is kebab-case
- [ ] Max 64 characters
- [ ] Matches directory name

**S5: Description Format**
- [ ] Single line (no multi-line `|`)
- [ ] Max 1024 characters

**S6: File Naming**
- [ ] All files (except SKILL.md) are kebab-case

**S7: Directory Naming**
- [ ] Skill directory is kebab-case
- [ ] Subdirectories are lowercase

### Step 4: Semantic Validation (Should Pass)

**M1: USE WHEN Clause**
- [ ] Description contains trigger phrases
- [ ] Uses "USE WHEN" or equivalent

**M2: Title Header**
- [ ] Body starts with `# skill-name`
- [ ] Header matches YAML `name` field

**M3: Examples Section**
- [ ] Has `## Examples` section
- [ ] Contains 2-3 usage patterns

**M4: Workflow Routing**
- [ ] If workflows exist, routing table present
- [ ] All workflows listed in table

**M5: File References**
- [ ] All files linked from SKILL.md
- [ ] No orphaned files

**M6: Workflow Location**
- [ ] Procedures in `workflows/`
- [ ] Reference docs at root

### Step 5: Content Quality (Recommendations)

**Q1: Concise Language**
- [ ] No verbose explanations
- [ ] Direct, actionable language

**Q2: Context Efficiency**
- [ ] SKILL.md under 500 lines
- [ ] Progressive disclosure used

**Q3: Trigger Specificity**
- [ ] Specific trigger phrases
- [ ] Keywords users would say

**Q4: Example Quality**
- [ ] Realistic user requests
- [ ] Clear outcomes shown

**Q5: Markdown Structure**
- [ ] Clear semantic headers
- [ ] Lists and tables where appropriate

### Step 6: Generate Report

Output format:

```markdown
## Validation Results for [skill-name]

**Location:** [full path]

### Errors (Must Fix)
❌ [Code]: [Description]
   Fix: [Specific suggestion]

### Warnings (Should Fix)
⚠️ [Code]: [Description]
   Fix: [Specific suggestion]

### Recommendations
💡 [Code]: [Description]
   Suggestion: [Improvement idea]

### Summary
| Category | Count |
|----------|-------|
| Errors | X |
| Warnings | X |
| Recommendations | X |

**Status:** [VALID / INVALID]
```

If VALID: Skill can be used as-is.
If INVALID: Errors must be fixed before skill functions.

## Example Run

```
User: Validate my prompting skill

Claude: Validating ~/.claude/skills/prompting/...

## Validation Results for prompting

**Location:** ~/.claude/skills/prompting/

### Errors (Must Fix)
None

### Warnings (Should Fix)
⚠️ M3: Examples section not found
   Fix: Add ## Examples with 2-3 usage patterns

### Recommendations
💡 Q2: SKILL.md is 93 lines (under 500, good)

### Summary
| Category | Count |
|----------|-------|
| Errors | 0 |
| Warnings | 1 |
| Recommendations | 1 |

**Status:** VALID (with warnings)

The skill will function but adding examples improves discoverability.
```
