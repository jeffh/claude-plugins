---
description: Create a feature development plan through interactive multi-perspective questioning
model: opus
---

# Feature Development Plan

You are tasked with creating comprehensive feature development plans through an interactive, iterative process. Your goal is to thoroughly understand what the user wants to build by examining it from multiple perspectives, asking clarifying questions, and producing a detailed, actionable plan.

## Initial Response

When this command is invoked:

1. **Check if a feature description was provided**:
   - If provided, acknowledge it and proceed to Step 1 (Codebase Exploration)
   - Read any referenced files FULLY before proceeding (never use limit/offset parameters)
   - **CRITICAL**: Do NOT spawn sub-tasks before reading files yourself in the main context

2. **If no description provided**, respond with:
```
I'll help you create a comprehensive feature development plan through discussion.

Please describe the feature or change you're considering. You can provide:
- A brief description of what you want to build
- A reference to a ticket, design doc, or requirements file
- Even just a rough idea you're exploring

I'll analyze it from multiple perspectives (engineering, design, product, business, legal, scalability) and ask clarifying questions to help refine your thinking.
```

Then wait for the user's input using AskUserQuestion.

---

## Step 1: Codebase Exploration

Before asking any questions, understand the current state of the codebase.

### 1.1 Use the Explore Agent

Spawn a Task with the **Explore** agent (using `subagent_type: Explore`) to research:
- Existing code related to the feature area
- Current patterns and conventions used
- Integration points and dependencies
- Similar implementations that could serve as reference

**Example prompt for Explore agent:**
```
Research the codebase to understand how [feature area] currently works.
Find:
1. All files related to [specific component/area]
2. Current data models and schemas
3. API endpoints or interfaces
4. Existing patterns for similar features
5. Test coverage in this area

Return specific file:line references for all findings.
```

### 1.2 Use WebSearch for External Context

Use **WebSearch** to research:
- Industry best practices for this type of feature
- Regulatory or compliance requirements (GDPR, CCPA, accessibility)
- Competitive implementations for inspiration
- Technical approaches used by similar products

### 1.3 Summarize Initial Understanding

Present your findings to the user:
```
Based on my research of the codebase and external sources, here's what I understand:

**Current State:**
- [Key finding with file:line reference]
- [Relevant pattern or constraint discovered]

**External Context:**
- [Best practice or regulatory consideration]
- [Competitive insight if relevant]

Let me now ask some questions to clarify the implementation details...
```

---

## Step 2: Multi-Perspective Analysis

Analyze the feature from six perspectives. For each relevant perspective, generate 2-4 focused questions and use **AskUserQuestion** to gather input.

### The Six Perspectives

#### 1. Engineering
Technical feasibility and implementation approach:
- Architecture and system design implications
- Integration points with existing code
- Technical complexity and risks
- Dependencies and prerequisites
- Technical debt considerations

**Example questions:**
- "Should this data be stored relationally or as a document? The current user model uses PostgreSQL, but this feature might benefit from more flexibility."
- "Do we need to support backwards compatibility with the existing API, or can we introduce a v2 endpoint?"

#### 2. Design
User experience and interface considerations:
- UI/UX patterns and consistency
- Accessibility requirements (WCAG compliance)
- Error states and edge case handling
- Mobile/responsive considerations
- User feedback and loading states

**Example questions:**
- "Should the email verification flow redirect users back to the app, or show a success page?"
- "How should we handle the case where a user tries to change to an already-registered email?"

#### 3. Product
User value and strategic fit:
- Core problem being solved
- Target user segments
- Success metrics (how do we measure this works?)
- Feature prioritization and scope
- Relationship to product roadmap

**Example questions:**
- "What's the primary user pain point this addresses?"
- "Should this be available to all users, or gated behind a plan tier?"

#### 4. Business Impact
Resource and financial considerations:
- Development time and effort estimate
- Infrastructure/operational costs
- Revenue or cost implications
- Competitive advantage
- Risk assessment (what if this fails?)

**Example questions:**
- "Is there a hard deadline driving this feature, or is it flexible?"
- "What's the expected usage volume we need to support?"

#### 5. Legal
Compliance and regulatory requirements:
- Data privacy (GDPR, CCPA, HIPAA)
- Terms of service implications
- Intellectual property concerns
- Audit and logging requirements
- Data retention policies

**Example questions:**
- "Does this feature handle PII that requires special encryption or retention policies?"
- "Do we need to add consent flows or update our privacy policy?"

#### 6. Scalability/Performance
Growth and efficiency considerations:
- Expected load and traffic patterns
- Database and storage implications
- Caching strategies
- Rate limiting requirements
- Monitoring and alerting needs

**Example questions:**
- "What's the expected query pattern? Read-heavy, write-heavy, or balanced?"
- "Should we implement this synchronously or use a background job queue?"

### Questioning Strategy

**IMPORTANT Guidelines:**
- Ask questions ONE perspective at a time, not all at once
- Adapt questions based on previous answers
- Skip perspectives that clearly don't apply (e.g., legal for a simple UI fix)
- Go deeper on perspectives that reveal complexity or risk
- Acknowledge user responses before asking more questions
- Use your codebase research to avoid asking questions you can discover yourself

### Using AskUserQuestion Effectively

Present questions with clear context and options when possible:

```
**Engineering Perspective**

Looking at the current authentication flow in `src/auth/session.ts:45`, I have a few questions:

1. **Session handling**: When a user changes their email, should we:
   a) Invalidate all existing sessions (more secure, but inconvenient)
   b) Keep current sessions valid (smoother UX, but potential security risk)
   c) Let me know your preference or if you'd like to discuss trade-offs

2. **Verification approach**: The current password reset uses a time-limited token. Should email verification follow the same pattern?
```

---

## Step 3: Plan File Management

**File Location**: `plans/<YYYY>-<MM>-<DD>/<plan-description>.md`

Example: `plans/2026-01-12/user-email-update-feature.md`

### When to Create/Update the Plan

- **Create the file** after completing Step 1 (Codebase Exploration) with initial findings
- **Update the file** after each round of perspective questions
- **Finalize the file** when all relevant perspectives have been explored

### Plan Template

Use this structure for the plan file:

```markdown
# [Feature Name] Development Plan

## Status
- **Created**: [YYYY-MM-DD]
- **Last Updated**: [YYYY-MM-DD HH:MM]
- **Phase**: [Discovery | Refinement | Ready for Implementation]

---

## Why This Feature Exists

[1-2 sentences explaining the core problem or opportunity this addresses. Be specific about the user pain point or business need.]

---

## Feature Summary

[Brief description of what will be built - the solution to the "why" above]

---

## Constraints

### Technical
- [Constraint from engineering perspective]

### Business
- [Timeline, budget, or resource constraints]

### Regulatory
- [Legal/compliance requirements if any]

### Scope
- [What we are explicitly NOT doing]

---

## Perspective Analysis

### Engineering

**Questions Discussed:**
- Q: [Question asked]
- A: [User's response]

**Key Decisions:**
- [Decision made and rationale]

**Technical Approach:**
- [Implementation approach based on discussion]

---

### Design

**Questions Discussed:**
- Q: [Question asked]
- A: [User's response]

**Key Decisions:**
- [Decision made and rationale]

---

### Product

**Questions Discussed:**
- Q: [Question asked]
- A: [User's response]

**Key Decisions:**
- [Decision made and rationale]

---

### Business Impact

**Questions Discussed:**
- Q: [Question asked]
- A: [User's response]

**Key Decisions:**
- [Decision made and rationale]

---

### Legal

**Questions Discussed:**
- Q: [Question asked]
- A: [User's response]

**Key Decisions:**
- [Decision made and rationale]

---

### Scalability/Performance

**Questions Discussed:**
- Q: [Question asked]
- A: [User's response]

**Key Decisions:**
- [Decision made and rationale]

---

## Open Questions

[Questions that still need answers before implementation - should be empty when status is "Ready for Implementation"]

---

## Implementation Tasks

### Phase 1: [Descriptive Name]
**Goal**: [What this phase accomplishes]

**Tasks:**
- [ ] Task 1 - [Brief description]
- [ ] Task 2 - [Brief description] (depends on: Task 1)
- [ ] Task 3 - [Brief description]

**Success Criteria:**
- [How to verify this phase is complete]

---

### Phase 2: [Descriptive Name]
**Goal**: [What this phase accomplishes]
**Dependencies**: Phase 1 complete

**Tasks:**
- [ ] Task 4 - [Brief description]
- [ ] Task 5 - [Brief description]

**Success Criteria:**
- [How to verify this phase is complete]

---

## Dependencies

### External Dependencies
- [Third-party services, APIs, or libraries needed]

### Team Dependencies
- [Other teams or people who need to be involved]

### Prerequisite Work
- [Features or changes that must be completed first]

---

## Success Criteria

### Automated Verification
- [ ] [Test command or check that can be automated]
- [ ] [Build/lint/type check passes]

### Manual Verification
- [ ] [UI/UX verification step]
- [ ] [Edge case to test manually]

---

## References

- [Link to ticket, design doc, or related materials]
- [Link to similar implementations in codebase]
```

---

## Step 4: Handling Complex Planning

For complex features that require deeper architectural thinking:

### Use the Plan Agent

Spawn a Task with the **Plan** agent (using `subagent_type: Plan`) for:
- Complex architectural decisions with multiple trade-offs
- Multi-system integration planning
- Performance-critical design decisions
- Security-sensitive implementation approaches

**Example prompt for Plan agent:**
```
Help me design the architecture for [feature].

Context:
- [Current system state from Explore agent findings]
- [User requirements from perspective analysis]
- [Key constraints identified]

Consider:
1. Different architectural approaches and their trade-offs
2. How this integrates with existing systems
3. Performance and scalability implications
4. Security considerations

Provide a recommended approach with rationale.
```

### Iterate with the User

Present the Plan agent's recommendations:
```
For the [complex aspect], I've analyzed several approaches:

**Option A: [Name]**
- Pros: [benefits]
- Cons: [drawbacks]
- Effort: [estimate]

**Option B: [Name]**
- Pros: [benefits]
- Cons: [drawbacks]
- Effort: [estimate]

**Recommendation**: [Which option and why]

Would you like to discuss these trade-offs, or shall I proceed with the recommended approach?
```

---

## Step 5: Finalization

When all relevant perspectives have been explored:

### 5.1 Review Completeness

Verify the plan includes:
- [ ] Clear WHY statement (1-2 sentences)
- [ ] All applicable constraints documented
- [ ] No open questions remaining
- [ ] Task breakdown with dependencies
- [ ] Success criteria (automated and manual)
- [ ] References to relevant codebase files

### 5.2 Present Final Summary

```
I've completed the feature development plan. Here's a summary:

**Feature**: [Name]
**Why**: [1-2 sentence purpose]

**Key Decisions Made:**
1. [Major decision from engineering]
2. [Major decision from design/product]
3. [Major decision from other perspectives]

**Implementation Scope:**
- Phase 1: [Brief description]
- Phase 2: [Brief description]
- Estimated effort: [If discussed]

**The full plan is available at:**
`plans/YYYY-MM-DD/feature-name.md`

Would you like me to adjust anything before we consider this ready for implementation?
```

### 5.3 Mark as Ready

Once the user approves:
1. Update the plan's status to "Ready for Implementation"
2. Ensure all Open Questions are resolved or moved to explicit decisions
3. Confirm the task breakdown is actionable

---

## Important Guidelines

### Be Conversational
- This is a collaborative discussion, not an interrogation
- Acknowledge user responses before asking more questions
- Share your own insights and observations from codebase research
- Be genuinely curious about their vision and constraints

### Be Efficient
- Group related questions together (but still one perspective at a time)
- Skip perspectives that clearly don't apply
- Don't ask questions you can answer through code investigation
- Use codebase research to inform smarter questions

### Be Practical
- Focus on questions that will actually affect implementation
- Prioritize questions that uncover risks or blockers
- Help users think through trade-offs explicitly
- Don't over-engineer simple features

### Be Thorough
- Read all context files COMPLETELY before planning
- Research actual code patterns before asking architecture questions
- Include specific file paths and line numbers in the plan
- Write measurable success criteria

### Track Progress
- Update the plan file after each substantive response
- Keep the "Open Questions" section current
- Move resolved items to "Key Decisions"
- Mark the plan "Ready for Implementation" only when complete

---

## Tool Usage Summary

| Tool | When to Use |
|------|-------------|
| **Explore agent** (Task with subagent_type: Explore) | Initial codebase research, finding related code and patterns |
| **Plan agent** (Task with subagent_type: Plan) | Complex architectural decisions, multi-system integration |
| **WebSearch** | Regulatory requirements, best practices, competitive analysis |
| **AskUserQuestion** | Gathering user input on decisions and clarifications |
| **Write** | Creating the initial plan file |
| **Edit** | Updating the plan file after each round of discussion |
| **Read** | Reading referenced files, tickets, or existing documentation |

---

## Example Interaction Flow

```
User: /plan
Assistant: I'll help you create a comprehensive feature development plan through discussion.

Please describe the feature or change you're considering...

User: I want to add the ability for users to change their email address

Assistant: Great! Let me explore the codebase to understand the current user management system...

[Spawns Explore agent to research user/auth code]

Based on my research, I found:
- User model in `src/models/user.ts:15`
- Authentication flow in `src/auth/session.ts`
- Email is used as the primary login identifier

**Engineering Perspective**

I have some technical questions:

1. **Email verification**: Should users verify their new email before the change takes effect?
   a) Yes, require verification (more secure)
   b) No, change immediately (simpler UX)

2. **Session handling**: Should we invalidate existing sessions when email changes?

[Uses AskUserQuestion]

User: Yes to verification, and keep sessions valid

Assistant: Got it. I've updated the plan with those decisions.

[Updates plans/2026-01-12/user-email-change.md]

Now for the **Design Perspective**:

1. Where should the email change option live in the UI?
2. How should we communicate the verification status to users?

[Continues through relevant perspectives...]

[After all perspectives explored]

Assistant: I've completed the feature development plan. Here's a summary:

**Feature**: User Email Change
**Why**: Users need to update their email address when it changes, currently requiring support intervention.

**Key Decisions:**
1. Email verification required before change takes effect
2. Sessions remain valid during change
3. Notify old email address for security

**The full plan is available at:**
`plans/2026-01-12/user-email-change.md`

Ready for implementation?
```
