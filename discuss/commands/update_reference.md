---
description: Update a reference document by checking its sources for changes
model: sonnet
---

# Update Reference Document

You are tasked with updating an existing reference document by checking its cited sources for changes. You will identify what has changed, update the document accordingly, and provide a clear summary highlighting any breaking changes.

## CRITICAL: YOUR PRIORITIES

1. **Breaking changes are the highest priority** - Always identify and prominently call out breaking changes
2. **Preserve document intent** - Update content without restructuring the document
3. **Source integrity** - Maintain accurate source citations with current retrieval dates
4. **Conservative updates** - Only update based on verifiable source changes

## Initial Response

When this command is invoked:

**If a file path was provided** (e.g., `/update-reference docs/zod-reference.md`):
- Immediately proceed to Step 1
- Do not ask for confirmation

**If no file path was provided**, respond with:
```
I'll help you update a reference document by checking its sources for changes.

Please provide the path to the reference document you want to update.

Example: `/update-reference ./docs/my-library-reference.md`
```

Then wait for the user to provide the file path.

## Steps to Follow

### Step 1: Read and Parse the Document

1. **Read the reference document FULLY using the Read tool**
   - IMPORTANT: Use the Read tool WITHOUT limit/offset parameters to read the entire file
   - This ensures you have complete context before analyzing

2. **Extract the Sources section**:
   - Look for a "## Sources", "## References", or similar section
   - Parse all URLs listed (official docs, GitHub repos, blog posts, etc.)
   - Note retrieval dates if present

3. **If no Sources section found**, respond with:
   ```
   I couldn't find a Sources section in this document. The /update-reference command requires a Sources section with URLs to check for updates.

   Would you like me to:
   1. Help you add a Sources section to this document
   2. Search for relevant sources based on the document content
   ```
   Then wait for the user's response.

4. **Catalog the current document structure**:
   - List all major sections and subsections
   - Identify version numbers mentioned (library versions, API versions)
   - Note any dated information or timestamps
   - Record the current "Last updated" date if present

### Step 2: Fetch Current Source Materials

Use WebFetch and WebSearch to retrieve current versions of all sources.

**For each source URL**:

1. **Use WebFetch** to retrieve the page content:
   - Prompt WebFetch to extract relevant technical information
   - Focus on version numbers, API signatures, configuration options
   - Request identification of deprecation notices and breaking changes

2. **Track the status of each source**:
   - **Available**: Successfully fetched, note key findings
   - **Redirected**: Note the new URL, fetch from new location
   - **Unavailable**: Mark for user notification

3. **If a source is unavailable**, use WebSearch to:
   - Find if the content moved to a new URL
   - Locate alternative official sources
   - Find archived versions if the content was removed

**Example WebFetch prompt**:
```
Extract the following from this documentation page:
- Current version number
- API methods and their signatures
- Configuration options and defaults
- Any deprecation notices
- Breaking changes from recent versions
- New features or capabilities
```

### Step 3: Compare and Identify Changes

Analyze differences between the reference document and current source materials.

**Categories of changes to identify** (in priority order):

1. **Breaking Changes** (CRITICAL - highest priority):
   - Changed behavior that affects existing code
   - Removed features or deprecated-then-removed APIs
   - Changed function/method signatures
   - Changed default values that affect behavior
   - Incompatible updates requiring migration
   - Minimum version requirement changes

2. **Deprecations**:
   - Newly deprecated methods, options, or patterns
   - Timeline for deprecation (if provided)
   - Recommended alternatives

3. **Version Changes**:
   - New major/minor/patch versions released
   - End-of-life announcements
   - LTS status changes

4. **API Changes**:
   - New methods or functions
   - New parameters on existing methods
   - New return types or properties

5. **Configuration Changes**:
   - New configuration options
   - Changed defaults (non-breaking)
   - New environment variables

6. **New Features**:
   - New capabilities
   - New integrations
   - Performance improvements

7. **Documentation Updates**:
   - Clarified instructions
   - New examples
   - Updated best practices

### Step 4: Update the Reference Document

Use the **Edit tool** to update the document section by section.

**Update process**:

1. **Update affected sections** with new information:
   - Add warnings for breaking changes inline where relevant
   - Mark deprecated content with clear deprecation notices
   - Add new content for new features (keep proportional to existing style)

2. **Add deprecation markers** where needed:
   ```markdown
   > **Deprecated in v3.0**: The `oldMethod()` function is deprecated.
   > Use `newMethod()` instead. Will be removed in v4.0.
   ```

3. **Add breaking change warnings** inline:
   ```markdown
   > **Breaking Change (v3.0)**: The `config.timeout` default changed from
   > 30s to 60s. Existing code relying on the 30s default may need updates.
   ```

4. **Update the Sources section**:
   - Update retrieval dates to today's date
   - Add any new sources used
   - Note sources that are no longer available
   - Update URLs that have changed

5. **Update metadata**:
   - Update "Last updated" timestamp to today's date
   - Update version numbers referenced in the document

6. **Add a changelog entry** (create section if it doesn't exist):
   ```markdown
   ## Changelog

   ### YYYY-MM-DD
   - **Breaking**: [List breaking changes]
   - **Deprecated**: [List deprecations]
   - **Added**: [List additions]
   - **Updated**: [List updates]
   - **Sources**: [Note source changes]
   ```

### Step 5: Generate Change Summary

After completing all edits, present a summary to the user:

```markdown
## Reference Document Update Summary

**Document**: [file path]
**Sources Checked**: [number of sources]
**Sources Available**: [number successfully fetched]
**Update Date**: YYYY-MM-DD

### Breaking Changes
[MOST IMPORTANT - List prominently]
- **[Change]**: [Description] - [Impact on existing code]
- **[Change]**: [Description] - [Migration required]

### Deprecations
- **[Item]**: Deprecated in [version], use [alternative]. Removal planned in [version].

### Version Updates
- [Library/API] updated from [old version] to [new version]

### New Features
- **[Feature]**: [Brief description of capability]

### Other Updates
- **[Section]**: [What changed]

### Source Status
| Source | Status | Notes |
|--------|--------|-------|
| [Name] | Updated | Retrieved YYYY-MM-DD |
| [Name] | URL Changed | Now at [new URL] |
| [Name] | Unavailable | [Reason if known] |

### Sections Modified
- [Section 1]: [Type of change]
- [Section 2]: [Type of change]

---
Would you like me to explain any of these changes in more detail?
```

## Important Guidelines

### Prioritize Breaking Changes
- Breaking changes MUST be called out prominently in both the document and summary
- Explain migration paths when available from source documentation
- Note the version where the breaking change occurred
- Add inline warnings in affected sections of the document

### Preserve Document Structure
- Do NOT restructure the document significantly
- Keep the original organization and section order
- Add new content in appropriate existing sections
- Only create new sections for major new feature areas
- Preserve any project-specific or custom content

### Source Integrity
- Always update source retrieval dates when sources are checked
- Note when sources become unavailable
- Add new sources when using new information
- Keep source URLs accurate (update if redirected)
- Include source retrieval dates in the Sources section

### Conservative Update Approach
- Only update based on verifiable source changes
- Do not add speculative or inferred information
- Note uncertainty when sources are ambiguous
- Preserve content that sources do not contradict
- When in doubt, ask the user

### Tool Usage

| Tool | Purpose |
|------|---------|
| **Read** | Read the existing reference document (always read FULLY without limit/offset) |
| **WebFetch** | Retrieve current content from source URLs |
| **WebSearch** | Find alternative sources, verify information, locate moved content |
| **Edit** | Update document sections (preferred - use for most updates) |
| **Write** | Only if document requires complete regeneration (rare, ask user first) |

## Error Handling

### No Sources Section Found
```
This document doesn't have a Sources section with URLs to check.

I cannot verify updates without knowing the original sources.

Options:
1. Add a Sources section manually with relevant URLs, then run /update-reference again
2. I can help you identify likely sources based on the document content
3. Use /reference to recreate the document with proper source citations

Which would you prefer?
```

### All Sources Unavailable
```
I couldn't reach any of the [N] sources listed in this document.

This might be due to:
- Temporary network issues
- Sources have been permanently removed
- URLs have changed and need updating

Would you like me to:
1. Search for alternative sources for [topic]?
2. Preserve current content and note that sources couldn't be verified?
3. Try again later?
```

### Some Sources Unavailable
```
I was able to fetch [X] of [Y] sources. The following were unavailable:
- [Source 1]: [URL] - [Error/reason if known]
- [Source 2]: [URL] - [Error/reason if known]

I can:
1. Proceed with available sources and note the unavailable ones
2. Search for alternative sources for the unavailable content
3. Wait while you verify the URLs

How would you like to proceed?
```

### Major Structural Changes in Source
```
The source documentation for [library/topic] has been significantly restructured.

Key changes detected:
- [List major structural changes]

Rather than making many fragmented updates, I recommend:
1. Review the structural changes first (I can summarize)
2. Consider regenerating the reference with /reference
3. Or I can attempt incremental updates (may be incomplete)

Which approach would you prefer?
```

### Version Mismatch
```
The document references [library] version [X], but the current version is [Y].

This is a [major/minor/patch] version difference, which typically means:
- [Explain implications based on semver]

Would you like me to:
1. Update the document to reflect version [Y]
2. Keep the document at version [X] (if intentionally pinned)
3. Create a note about version differences without updating
```

## Example Interaction Flows

### Standard Update Flow

```
User: /update-reference docs/react-query-reference.md
Assistant: I'll check the sources in your React Query reference document for updates.

[Reads the document using Read tool]

I found 4 sources in your reference document:
- Official docs: https://tanstack.com/query/latest (retrieved 2025-06-15)
- GitHub: https://github.com/TanStack/query
- Migration guide: https://tanstack.com/query/latest/docs/react/guides/migrating-to-v5
- Blog post: https://tkdodo.eu/blog/practical-react-query

Let me fetch current content from these sources...

[Uses WebFetch on each source URL]

## Reference Document Update Summary

**Document**: docs/react-query-reference.md
**Sources Checked**: 4
**Sources Available**: 4
**Update Date**: 2026-01-12

### Breaking Changes
- **Default staleTime**: Changed from 0 to 5 minutes in v5.1 - Code relying on immediate refetches may behave differently
- **useQuery signature**: Object-only syntax now required - Must include queryKey in all useQuery calls

### Deprecations
- **onSuccess/onError callbacks**: Deprecated in v5.0, use useEffect instead. Removal planned in v6.0.

### Version Updates
- TanStack Query updated from v5.0 to v5.59

### New Features
- **useSuspenseQuery**: New hook for React Suspense integration
- **queryOptions**: Type-safe query configuration helper

### Source Status
| Source | Status | Notes |
|--------|--------|-------|
| Official docs | Updated | Retrieved 2026-01-12 |
| GitHub | Updated | Retrieved 2026-01-12 |
| Migration guide | Updated | Retrieved 2026-01-12 |
| Blog post | Updated | Retrieved 2026-01-12 |

I've updated the document with these changes. Would you like me to explain any of them in more detail?
```

### Update with Unavailable Sources

```
User: /update-reference docs/legacy-api-reference.md
Assistant: I'll check the sources in your legacy API reference document.

[Reads the document]

I found 3 sources:
- API docs: https://old-api.example.com/docs
- GitHub wiki: https://github.com/example/old-api/wiki
- Blog announcement: https://blog.example.com/old-api-launch

Let me fetch current content...

[Attempts WebFetch on each URL]

I was able to fetch 1 of 3 sources. The following were unavailable:
- API docs: https://old-api.example.com/docs - 404 Not Found
- Blog announcement: https://blog.example.com/old-api-launch - Domain expired

I can:
1. Proceed with the GitHub wiki and note the unavailable sources
2. Search for alternative documentation sources
3. Wait while you verify the URLs

User: Let's proceed with what we have and search for alternatives
Assistant: I'll update using the available source and search for alternatives.

[Uses WebSearch to find alternative documentation]

I found an archived version of the API docs on the Wayback Machine and the project has moved to a new repository.

## Reference Document Update Summary

**Document**: docs/legacy-api-reference.md
**Sources Checked**: 3
**Sources Available**: 1 (+ 1 archived, 1 new location found)
**Update Date**: 2026-01-12

### Source Status
| Source | Status | Notes |
|--------|--------|-------|
| API docs | Unavailable | Found archived version at web.archive.org |
| GitHub wiki | Updated | Retrieved 2026-01-12 |
| Blog | Unavailable | Domain expired, no archive found |

### Updates Made
- Added note about API documentation being archived
- Updated GitHub link to new repository location
- Marked blog source as unavailable in Sources section

No breaking changes were identified in the available sources.
```

### No Changes Found

```
User: /update-reference docs/stable-library-reference.md
Assistant: I'll check the sources in your stable library reference document.

[Reads document and fetches all sources]

## Reference Document Update Summary

**Document**: docs/stable-library-reference.md
**Sources Checked**: 3
**Sources Available**: 3
**Update Date**: 2026-01-12

### No Changes Detected

All source content matches the current documentation. The reference document is up to date.

### Source Status
| Source | Status | Notes |
|--------|--------|-------|
| Official docs | No changes | Content unchanged since last update |
| GitHub README | No changes | Same version (v2.4.1) |
| API reference | No changes | All methods match documentation |

I've updated the retrieval dates in the Sources section to reflect today's check. No other changes were necessary.
```

## Important Notes

- **Critical ordering**: Always follow the numbered steps in sequence
  - Step 1: Read the document FULLY before analyzing
  - Step 2: Fetch ALL sources before comparing
  - Step 3: Complete analysis before making any edits
  - Step 4: Make all edits before generating summary
  - Step 5: Present complete summary at the end

- **Breaking changes first**: When presenting findings, always lead with breaking changes

- **Preserve user content**: If the document contains project-specific notes, examples, or customizations not from the sources, preserve them unchanged

- **Version pinning**: If a document appears intentionally pinned to an older version (noted in metadata or comments), ask before updating to newer versions

- **Changelog hygiene**: Add new changelog entries at the TOP of the changelog section, keeping history in reverse chronological order

- **Source date format**: Use ISO date format (YYYY-MM-DD) for all retrieval dates in the Sources section
