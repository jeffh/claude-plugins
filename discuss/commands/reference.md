---
description: Create or edit reference documentation for tools, products, or libraries with interactive Q&A
argument-hint: '[topic] [url1 url2 ...]'
model: sonnet
---

# Reference Documentation Command

You are tasked with creating comprehensive, well-cited reference documentation for tools, products, or libraries. This is an interactive process: you gather requirements, research sources, optionally analyze codebase integration, write the documentation, and support ongoing Q&A to expand the reference.

## CRITICAL: Source Citation is Non-Negotiable

Every piece of information in the reference document MUST be traceable to a cited source. This enables `/update-reference` to verify and refresh the documentation later. If you cannot cite a source for information, do not include it.

---

## Step 1: Gather Requirements

When this command is invoked, immediately use **AskUserQuestion** to collect essential information. Ask all questions in a single interaction:

```
I'll help you create reference documentation. Let me gather some information first.

1. **What do you want reference documentation for?**
   - Name of the tool, product, library, or API
   - Brief description if it's not well-known

2. **Do you have URLs to reference materials?**
   - Official documentation
   - GitHub repository
   - Tutorials or guides
   - API references
   (Provide as many as you have; I can search for more)

3. **Where should I save the reference document?**
   - Example: `./docs/[name]-reference.md`
   - Example: `./references/[name].md`
   - Or specify your preferred location

4. **Is this reference contextual to your current project?**
   - Yes: I'll analyze how to use it within this codebase
   - No: I'll create general-purpose reference documentation
```

**If parameters were provided with the command** (e.g., `/reference zod https://zod.dev`):
- Acknowledge the provided information
- Ask only the remaining questions (output location, project context)

**Wait for the user's response before proceeding to Step 2.**

---

## Step 2: Fetch and Analyze Source Materials

### 2a. Fetch Provided URLs

Use **WebFetch** to retrieve content from each URL the user provided:

```
Fetching reference materials...

- [URL 1]: [Status - fetched/failed/redirected]
- [URL 2]: [Status - fetched/failed/redirected]
...
```

For each URL:
- Extract key concepts, APIs, configuration options, and examples
- Note the page title and any version information
- Track the URL and current date for citation

### 2b. Search for Additional Resources

Use **WebSearch** to find supplementary materials:

- Official documentation (if not provided)
- Getting started guides
- API reference pages
- Common patterns and best practices
- Troubleshooting guides
- Version/changelog information

**Search queries to consider:**
- `[tool name] official documentation`
- `[tool name] getting started guide`
- `[tool name] API reference`
- `[tool name] best practices`
- `[tool name] common issues solutions`

### 2c. Build Source Registry

Maintain a running list of all sources:

```
Sources collected:
1. [Title] - [URL] - Retrieved [YYYY-MM-DD]
2. [Title] - [URL] - Retrieved [YYYY-MM-DD]
...
```

**IMPORTANT**: Every fact in the final document must trace back to one of these sources.

---

## Step 3: Codebase Integration Analysis (If Project-Contextual)

**Skip this step if the user indicated this is NOT project-contextual.**

If the reference is contextual to the current project, use the **Task tool** to spawn an exploration agent:

### Spawn Codebase Exploration Task

```
Task prompt: "Explore this codebase to understand how [tool/library] could be integrated or is already being used.

Find and document:
1. **Existing usage**: Any files that already import or use [tool/library]
2. **Related patterns**: Similar libraries or tools already in use that follow patterns we should match
3. **Configuration locations**: Where config files live (package.json, tsconfig, .env, etc.)
4. **Integration points**: Where [tool/library] would likely be used based on the codebase structure
5. **Dependency information**: Current versions of related dependencies

Return findings with specific file paths and line numbers."
```

### Analyze Exploration Results

From the exploration findings, identify:
- **Existing usage patterns** to document
- **Version compatibility** considerations
- **Project conventions** that integration should follow
- **Specific files/locations** relevant to the user

---

## Step 4: Write Initial Reference Document

Use the **Write tool** to create the reference document at the user-specified location.

### Reference Document Template

```markdown
# [Tool/Library Name] Reference

> [One-line description of what this tool does]

**Version documented**: [Version number if applicable]
**Last updated**: [YYYY-MM-DD]
**Created with**: `/reference` command

---

## Overview

[2-3 paragraphs explaining:
- What the tool/library does
- Key problems it solves
- When you would use it]

## Quick Start

[Minimal steps to get started - should be copy-paste ready]

\`\`\`[language]
[Installation command]
\`\`\`

\`\`\`[language]
[Basic usage example]
\`\`\`

## Installation

### Requirements
- [Requirement 1]
- [Requirement 2]

### Install
\`\`\`[language]
[Installation commands with options explained]
\`\`\`

## Core Concepts

### [Concept 1]
[Explanation with example]

### [Concept 2]
[Explanation with example]

## Usage

### Basic Usage
[Common use cases with code examples]

### Advanced Usage
[More complex patterns, configuration options]

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| [opt1] | [type] | [default] | [description] |
| [opt2] | [type] | [default] | [description] |

## API Reference

### [Function/Method 1]
\`\`\`[language]
[Signature]
\`\`\`
[Description, parameters, return value, example]

### [Function/Method 2]
...

## Integration with This Project
<!-- Include this section ONLY if project-contextual -->

### Current Usage
[Where this is already used, with file:line references]

### Recommended Integration
[How to use within this codebase, following existing patterns]

### Configuration in This Project
[Project-specific configuration details]

## Common Issues & Solutions

### [Issue 1]
**Problem**: [Description]
**Solution**: [How to fix]

### [Issue 2]
...

## Best Practices

- [Practice 1]: [Explanation]
- [Practice 2]: [Explanation]
- [Practice 3]: [Explanation]

## Sources

<!-- CRITICAL: This section enables /update-reference to work -->

- [Source Title 1](URL) - Retrieved YYYY-MM-DD
- [Source Title 2](URL) - Retrieved YYYY-MM-DD
- [Source Title 3](URL) - Retrieved YYYY-MM-DD
...

---

*Reference created with `/reference` command*
```

### Writing Guidelines

- **Be concise**: Focus on practical usage, not exhaustive API documentation
- **Include examples**: Every concept should have a code example
- **Make it scannable**: Use headers, tables, and bullet points
- **Code should run**: Examples should be copy-paste ready
- **Cite inline when helpful**: For complex topics, note which source has more detail

---

## Step 5: Present Document and Invite Q&A

After writing the initial document, present it to the user:

```
I've created the reference document at [path].

**Summary of what's documented:**
- [Key section 1]
- [Key section 2]
- [Key section 3]

**Sources used:** [N] sources cited

---

Feel free to ask any questions about [tool/library]. I'll answer from the reference material when possible. If your question requires additional research, I'll:
1. Research to find the answer
2. Verify by testing if applicable
3. Add the new information to the reference document
4. Cite the new sources

You can also ask me to:
- Expand on specific topics
- Add more examples
- Include additional API methods
- Clarify confusing sections
- Add project-specific integration guidance
```

---

## Step 6: Handle Ongoing Q&A

### When the User Asks a Question

**6a. Check if answerable from existing research:**
- Review the source materials already fetched
- If the answer is available, respond directly

**6b. If NOT answerable from existing research:**

1. **Research the answer:**
   - Use **WebSearch** to find relevant information
   - Use **WebFetch** to retrieve detailed content
   - Track new sources for citation

2. **Verify if testable:**
   - If the question involves behavior that can be tested (commands, code execution):
   ```
   I found information suggesting [X]. Would you like me to verify this by testing it?
   ```
   - Use **Bash** (read-only operations) to verify when appropriate

3. **Respond to the user and offer to update document:**
   ```
   [Answer to the question]

   Source: [Source Title](URL)

   Would you like me to add this information to the reference document?
   ```

4. **If the user confirms, add findings to the document:**
   - Use **Edit** to add the new information to the appropriate section
   - Add new sources to the Sources section
   - Update the "Last updated" date
   - Confirm the update:
   ```
   I've added this information to the reference document in the [Section Name] section.

   New source added:
   - [Source Title](URL) - Retrieved YYYY-MM-DD
   ```

### Types of Follow-Up Requests

| Request Type | Action |
|--------------|--------|
| "Add more detail on X" | Research X, answer, offer to update document |
| "Show me an example of Y" | Find/create example, offer to add to Usage section |
| "How do I do Z in this project?" | Explore codebase, answer, offer to add to Integration section |
| "What about [edge case]?" | Research, answer, offer to add to Common Issues |
| "Is this compatible with [thing]?" | Research compatibility, answer, offer to document findings |
| "Add that to the doc" / "Yes" | Update the reference document with the previous answer |

---

## Step 7: Finalization

When the user indicates they're done (or conversation naturally concludes):

1. **Review document completeness:**
   - All major sections filled in
   - Examples provided for key concepts
   - Sources properly cited

2. **Verify source coverage:**
   - Every substantive claim has a source
   - Sources section is complete and accurate
   - Retrieval dates are present

3. **Confirm with user:**
   ```
   The reference document is complete at [path].

   **Document includes:**
   - [X] sections covering [main topics]
   - [N] code examples
   - [M] sources cited

   **Ready for:**
   - Use as reference documentation
   - Updates via `/update-reference` command

   Let me know if you'd like any final additions or changes.
   ```

---

## Important Guidelines

### Source Citation is Critical
- EVERY piece of information must have a source
- Include URLs and retrieval dates
- The Sources section enables `/update-reference` to work
- Do not include information you cannot cite
- Prefer official documentation over blog posts or Stack Overflow

### Quality Over Quantity
- Focus on what the user actually needs
- Prioritize practical usage over comprehensive API dumps
- Include examples for complex concepts
- Keep code examples concise and runnable

### Verify When Possible
- If something can be tested, offer to test it
- Note any information that could not be verified
- Mark unofficial/community sources clearly
- Flag version-specific information

### Project Context Matters (When Applicable)
- Show integration examples using actual codebase patterns
- Reference existing code that demonstrates usage
- Note version compatibility with current dependencies
- Link to existing files that would interact with the tool

### Tool Usage Summary

| Tool | Purpose |
|------|---------|
| **AskUserQuestion** | Gather requirements and preferences |
| **WebFetch** | Retrieve content from documentation URLs |
| **WebSearch** | Find additional resources and answers |
| **Task** | Spawn codebase exploration agent |
| **Write** | Create the initial reference document |
| **Edit** | Update document with new findings |
| **Bash** | Test/verify claims (read-only operations) |

---

## Example Interaction Flows

### Example 1: New Library Reference (No Initial Parameters)

```
User: /reference
Assistant: [Uses AskUserQuestion to gather requirements]

I will help you create reference documentation. Let me gather some information first.

1. What do you want reference documentation for?
2. Do you have URLs to reference materials?
3. Where should I save the reference document?
4. Is this reference contextual to your current project?

User: Zod validation library. URLs: https://zod.dev, https://github.com/colinhacks/zod
Save to ./docs/zod-reference.md. Yes, it is for this project.
Assistant: Great! I will create reference documentation for Zod.

[Uses WebFetch on https://zod.dev and https://github.com/colinhacks/zod]
[Uses WebSearch for "zod typescript validation best practices"]
[Uses Task tool to explore codebase for existing validation patterns]

Sources collected:
1. Zod Official Documentation - https://zod.dev - Retrieved 2026-01-12
2. Zod GitHub Repository - https://github.com/colinhacks/zod - Retrieved 2026-01-12
3. Zod Best Practices Guide - https://zod.dev/guides/best-practices - Retrieved 2026-01-12

[Writes reference document to ./docs/zod-reference.md]

I have created the reference document at ./docs/zod-reference.md.

**Summary of what is documented:**
- Schema definition and validation basics
- Type inference with z.infer
- Common schema types and modifiers
- Integration patterns for this project

**Sources used:** 3 sources cited

Feel free to ask any questions about Zod...

User: How do I validate nested objects with optional fields?
Assistant: [Checks existing research - answer not fully covered]
[Uses WebSearch for "zod nested objects optional fields"]
[Uses WebFetch on relevant result]

You can validate nested objects with optional fields using z.object() combined with .optional():

const UserSchema = z.object({
  name: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zip: z.string().optional(),  // Optional within nested object
  }).optional(),  // Entire nested object is optional
});

Source: [Zod Nested Objects Guide](https://zod.dev/docs/objects)

Would you like me to add this information to the reference document?

User: Yes, add it.
Assistant: [Uses Edit to update reference document]

I have added this information to the reference document in the Usage > Advanced Usage section.

New source added:
- Zod Nested Objects Guide - https://zod.dev/docs/objects - Retrieved 2026-01-12
```

### Example 2: Reference with Initial Parameters

```
User: /reference prisma https://www.prisma.io/docs
Assistant: I will create reference documentation for Prisma using the provided documentation URL.

[Uses AskUserQuestion - only asks remaining questions]

I see you want documentation for Prisma. I have the official docs URL. A couple more questions:

1. Where should I save the reference document?
2. Is this reference contextual to your current project?

User: Save to ./docs/prisma-reference.md. Not project-contextual, general reference.
Assistant: Perfect. Creating general-purpose Prisma reference documentation.

[Uses WebFetch on https://www.prisma.io/docs]
[Uses WebSearch for additional Prisma resources]
[Skips codebase exploration since not project-contextual]

[Writes reference document - excludes "Integration with This Project" section]

I have created the reference document at ./docs/prisma-reference.md...
```

### Example 3: Follow-up Question Requiring Research and Testing

```
User: Does Zod support async validation?
Assistant: [Checks existing research - async validation not covered]
[Uses WebSearch for "zod async validation refine"]
[Uses WebFetch on https://zod.dev/docs/refine]

Yes, Zod supports async validation through .refine() and .superRefine() with async functions. You must use .parseAsync() or .safeParseAsync() when your schema includes async refinements.

I found this requires using parseAsync - would you like me to verify this behavior by testing it?

User: Yes, please verify.
Assistant: [Uses Bash to create and run test file]

Verified: Async validation works as documented. Using .parse() on an async schema throws an error, but .parseAsync() works correctly.

Source: [Zod Refine Documentation](https://zod.dev/docs/refine)

Would you like me to add this information to the reference document?

User: Yes please.
Assistant: [Uses Edit to update reference document]

I have added this information to the reference document:
- Added "Async Validation" subsection under Advanced Usage
- Added example code showing .refine() with async function
- Noted the requirement to use parseAsync/safeParseAsync
- Updated Sources section

New source added:
- Zod Refine Documentation - https://zod.dev/docs/refine - Retrieved 2026-01-12
```
