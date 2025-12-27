# Skill Validation Rules

Complete validation checklist for Claude Code skills. Rules are categorized by severity.

## Structural Validation (Must Pass)

These are hard requirements. A skill cannot function without passing these.

### S1: SKILL.md Exists
- File `SKILL.md` must exist (case-sensitive, uppercase)
- Must be in the skill root directory

### S2: Valid YAML Frontmatter
- Must start with `---` on line 1 (no blank lines before)
- Must end with `---` before markdown content
- Must use spaces for indentation (not tabs)
- Must be valid YAML syntax

### S3: Required Fields Present
- `name` field must exist and be non-empty
- `description` field must exist and be non-empty

### S4: Name Format
- Must be kebab-case (lowercase letters, numbers, hyphens only)
- Max 64 characters
- Must match the directory name

### S5: Description Format
- Must be single line (no `|` multi-line syntax)
- Max 1024 characters

### S6: File Naming
- All files except SKILL.md must use kebab-case
- No spaces, underscores, or uppercase in file names

### S7: Directory Naming
- Skill directory must be kebab-case
- Subdirectories (workflows/, tools/) must be lowercase

## Semantic Validation (Should Pass)

These ensure the skill will be discoverable and usable.

### M1: USE WHEN Clause
- Description should contain "USE WHEN" or equivalent trigger phrases
- Triggers should use "OR" to combine multiple phrases
- Example: "USE WHEN user wants to create a skill OR modify a skill"

### M2: Title Header
- Markdown body should start with `# skill-name`
- Header should match the YAML `name` field

### M3: Examples Section
- Should have `## Examples` section
- Should contain 2-3 concrete usage patterns
- Each example should show user request and outcome

### M4: Workflow Routing
- If `workflows/` directory exists, SKILL.md should have routing table
- Table should list all workflows with triggers

### M5: File References
- All files in skill directory should be linked from SKILL.md
- No orphaned files (not referenced anywhere)

### M6: Workflow Location
- Operational procedures should be in `workflows/` subdirectory
- Reference docs should be at skill root

## Content Quality (Recommendations)

These improve skill effectiveness. Warnings, not errors.

### Q1: Concise Language
- Avoid verbose explanations
- Use direct, actionable language
- No filler phrases ("you might want to consider...")

### Q2: Context Efficiency
- SKILL.md should be under 500 lines
- Use progressive disclosure for detailed content
- Link to reference docs instead of inlining

### Q3: Trigger Specificity
- USE WHEN triggers should be specific
- Include keywords users would naturally say
- Avoid vague descriptions ("helps with documents")

### Q4: Example Quality
- Examples should show realistic user requests
- Include expected outcomes
- Cover different use cases

### Q5: Markdown Structure
- Use clear semantic headers
- Use bulleted lists for clarity
- Use tables for structured data

## Validation Output Format

Report findings in three categories:

```
## Validation Results for [skill-name]

### Errors (Must Fix)
❌ S3: Missing required field 'description'
❌ S4: Name 'Create_Skill' is not kebab-case

### Warnings (Should Fix)
⚠️ M1: Description lacks USE WHEN clause
⚠️ M3: Examples section not found

### Recommendations
💡 Q2: SKILL.md is 650 lines, consider splitting
💡 Q3: Triggers are vague, add specific keywords

### Summary
- Errors: 2
- Warnings: 2
- Recommendations: 2
- Status: INVALID (errors must be fixed)
```

## Quick Reference

| Code | Rule | Severity |
|------|------|----------|
| S1 | SKILL.md exists | Error |
| S2 | Valid YAML frontmatter | Error |
| S3 | Required fields present | Error |
| S4 | Name is kebab-case | Error |
| S5 | Description is single line | Error |
| S6 | File naming kebab-case | Error |
| S7 | Directory naming lowercase | Error |
| M1 | USE WHEN clause | Warning |
| M2 | Title header matches name | Warning |
| M3 | Examples section exists | Warning |
| M4 | Workflow routing table | Warning |
| M5 | No orphaned files | Warning |
| M6 | Proper file organization | Warning |
| Q1 | Concise language | Recommendation |
| Q2 | Context efficiency | Recommendation |
| Q3 | Trigger specificity | Recommendation |
| Q4 | Example quality | Recommendation |
| Q5 | Markdown structure | Recommendation |
