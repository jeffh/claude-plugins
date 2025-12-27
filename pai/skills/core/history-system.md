# PAI History System

The Personal AI Infrastructure maintains a comprehensive history at `~/.claude/pai-history/`. This system captures session activity, tool outputs, learnings, research, and decisions for future context and continuity.

## Directory Structure

```
~/.claude/pai-history/
├── sessions/          # Session lifecycle events
├── raw-outputs/       # Complete tool output logs
├── learnings/         # Extracted insights and patterns
├── research/          # Research outputs and findings
└── decisions/         # Decision logs with rationale
```

---

## sessions/

**Purpose**: Track session lifecycle events (start, end, duration).

**File naming**: `YYYY-MM-DD.jsonl`

**Format**: JSON Lines (one JSON object per line)

```jsonl
{"timestamp":"2025-12-26T10:30:00.000Z","event":"start","session_id":"abc123","source":"startup","cwd":"/path/to/project","transcript_path":"/path/to/transcript.jsonl"}
{"timestamp":"2025-12-26T11:45:00.000Z","event":"end","session_id":"abc123","cwd":"/path/to/project","transcript_path":"/path/to/transcript.jsonl","duration_ms":4500000}
```

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 | When the event occurred |
| `event` | `"start"` \| `"end"` | Session lifecycle event |
| `session_id` | string | Unique session identifier |
| `source` | string | How session started: `startup`, `resume`, `clear`, `compact` |
| `cwd` | string | Working directory |
| `transcript_path` | string | Path to session transcript |
| `duration_ms` | number | Session duration (end events only) |

---

## raw-outputs/

**Purpose**: Capture all tool invocations and their outputs for complete audit trail.

**File naming**: `YYYY-MM-DD.jsonl`

**Format**: JSON Lines

```jsonl
{"timestamp":"2025-12-26T10:35:00.000Z","session_id":"abc123","tool_name":"Read","tool_use_id":"toolu_xyz","tool_input":{"file_path":"/src/main.ts"},"tool_output":"file contents...","cwd":"/path/to/project"}
{"timestamp":"2025-12-26T10:35:05.000Z","session_id":"abc123","tool_name":"Edit","tool_use_id":"toolu_abc","tool_input":{"file_path":"/src/main.ts","old_string":"foo","new_string":"bar"},"tool_output":"File edited","cwd":"/path/to/project"}
```

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 | When tool was invoked |
| `session_id` | string | Session that invoked the tool |
| `tool_name` | string | Name of the tool (Read, Edit, Bash, etc.) |
| `tool_use_id` | string | Unique tool invocation ID |
| `tool_input` | object | Parameters passed to the tool |
| `tool_output` | string | Tool's output (may be truncated) |
| `tool_error` | string | Error message if tool failed |
| `cwd` | string | Working directory |

**Tool Categories**:
- **Research**: WebSearch, WebFetch, Grep, Glob, Read
- **Decision**: Edit, Write, Bash
- **Other**: TodoWrite, Task, etc.

---

## learnings/

**Purpose**: Store extracted insights, patterns, and knowledge discovered during sessions.

**File naming**: `YYYY-MM-DD-{topic}.md`

**Format**: Markdown with YAML frontmatter

```markdown
---
date: 2025-12-26
session_id: abc123
category: codebase-pattern
source_tool: Read
source_file: /src/auth/middleware.ts
---

# Authentication Middleware Pattern

## Discovery
While implementing feature X, discovered that the codebase uses a middleware chain pattern for authentication.

## Pattern
1. All auth checks go through `authMiddleware()`
2. Role-based access uses `requireRole('admin')`
3. Token validation happens in `validateToken()`

## Files
- `src/auth/middleware.ts:45` - Main middleware
- `src/auth/roles.ts:12` - Role definitions

## Implications
New auth features should follow this pattern rather than implementing custom checks.
```

**Frontmatter Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `date` | YYYY-MM-DD | When the learning was recorded |
| `session_id` | string | Session where learning was discovered |
| `category` | string | Type: `codebase-pattern`, `api-usage`, `debugging`, `best-practice` |
| `source_tool` | string | Tool that led to the discovery |
| `source_file` | string | Primary file related to learning |

---

## research/

**Purpose**: Store research outputs from investigation tasks.

**File naming**: `YYYY-MM-DD-{topic}.md`

**Format**: Markdown with YAML frontmatter

```markdown
---
date: 2025-12-26
session_id: abc123
query: "React 19 new features"
sources:
  - https://react.dev/blog/2024/04/25/react-19
  - https://github.com/facebook/react/releases
---

# React 19 New Features Research

## Summary
React 19 introduces several new features including...

## Key Findings

### 1. Actions
- New `useActionState` hook for form handling
- Server Actions for server-side mutations

### 2. Document Metadata
- Native support for `<title>`, `<meta>`, `<link>` in components

### 3. Asset Loading
- New `preload` and `preinit` APIs

## Sources
- [React 19 Blog Post](https://react.dev/blog/2024/04/25/react-19)
- [React GitHub Releases](https://github.com/facebook/react/releases)

## Methodology
Used WebSearch for initial discovery, then WebFetch for detailed documentation.
```

**Frontmatter Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `date` | YYYY-MM-DD | When research was conducted |
| `session_id` | string | Session that performed research |
| `query` | string | Original research question |
| `sources` | array | URLs and references used |

---

## decisions/

**Purpose**: Log significant decisions with context and rationale.

**File naming**: `YYYY-MM-DD.jsonl`

**Format**: JSON Lines

```jsonl
{"timestamp":"2025-12-26T10:40:00.000Z","session_id":"abc123","decision":"Use React Query for data fetching","context":"Evaluating data fetching solutions for the dashboard","alternatives":["SWR","RTK Query","Custom hooks"],"rationale":"React Query has better devtools and mutation handling for our use case"}
{"timestamp":"2025-12-26T11:00:00.000Z","session_id":"abc123","decision":"Place new component in src/components/shared/","context":"Creating a reusable button component","alternatives":["src/components/ui/","src/shared/"],"rationale":"Following existing pattern where shared components live in src/components/shared/"}
```

**Fields**:
| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | ISO 8601 | When decision was made |
| `session_id` | string | Session that made the decision |
| `decision` | string | What was decided |
| `context` | string | Why the decision was needed |
| `alternatives` | array | Other options considered |
| `rationale` | string | Why this choice was made |

---

## Usage Guidelines

### Writing to History

1. **Sessions**: Automatically captured by `session-capture.ts` hook
2. **Raw Outputs**: Automatically captured by `tool-capture.ts` hook
3. **Learnings**: Manually created when discovering patterns or insights
4. **Research**: Created by Researcher agent or during investigation tasks
5. **Decisions**: Log when making significant architectural or implementation choices

### Reading from History

Reference history to provide context:

```bash
# Find recent sessions
ls -lt ~/.claude/pai-history/sessions/ | head

# Search for past learnings about auth
grep -r "auth" ~/.claude/pai-history/learnings/

# Find decisions about a specific topic
grep "React" ~/.claude/pai-history/decisions/*.jsonl
```

### Maintenance

- JSONL files grow over time; consider periodic archiving
- Markdown files should be self-contained and searchable
- Old sessions can be compressed or moved to archive
