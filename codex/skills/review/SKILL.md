---
name: review
model: claude-sonnet-5
effort: low
argument-hint: "[--model <gpt-model>] [review focus]"
description: Delegate a read-only code review to a Codex subagent (GPT 5.5) that inspects code and reports findings without editing anything. Use when the user wants Codex — or "GPT-5.5" — to review, look over, audit, or give a second opinion on a diff, branch, pull request, or commit, whether they say "have Codex review…", "get Codex's take on my changes", or type `/codex:review`. Do NOT use when the user wants Codex to fix or implement changes (use codex:implement); to drive desktop or browser UI (use codex:computer); or when they want Claude's own review rather than a Codex second opinion (use the code-review skill).
---

# Codex Review

Delegate a read-only code review to a Codex subagent running **GPT 5.5** (or another GPT model the user names). The subagent reads code and returns findings; it does not write files.

## Choosing the model

The `-m` flag selects the model. Default to `gpt-5.5`, but honor any specific model the user asks for:

- Use `gpt-5.5` unless the user names a different model.
- If the user specifies a model — e.g. "review with gpt-5.6-terra", "use gpt-5.5-codex", "with the `<name>` model" — pass that exact string to `-m` instead. Don't validate or second-guess the name; Codex will error if it's unknown.
- If they typed `/codex:review --model <name> <task>` (or `-m <name>`), strip that flag from the review instructions and use `<name>` as the model.

The command below shows `-m gpt-5.5`; substitute the chosen model.

## How to invoke

Codex has a dedicated review subcommand. Pick the target based on what the user wants reviewed:

| User asks to review | Flag |
|---|---|
| Working-tree changes (staged + unstaged + untracked) | `--uncommitted` |
| Everything on this branch vs `main` (or another branch) | `--base main` |
| A specific commit | `--commit <SHA>` |
| Nothing specified (defaults to current branch vs its merge base) | (no flag) |

Command shape:

```
codex exec review \
  -m gpt-5.5 \
  --skip-git-repo-check \
  -C "$PWD" \
  <target-flag> \
  "<REVIEW-PROMPT>"
```

- `-m gpt-5.5` — the model; default `gpt-5.5`, or the model the user named (see [Choosing the model](#choosing-the-model)).
- `codex exec review` (not plain `codex review`) — the `exec` form is non-interactive and prints to stdout.
- No `-s` / `-a` needed: review mode is inherently read-only.
- **Always set an explicit Bash `timeout`.** Reviews are slow and the Bash default (120000 ms / 2 min) will cut Codex off before it finishes. Pass `timeout: 600000` (10 min — the maximum the Bash tool allows) on every `codex exec review` call. For a very large diff that may exceed 10 minutes, run the Bash call with `run_in_background: true` and poll instead, since a foreground call cannot exceed the 600000 ms cap.
- If the user did not specify a target, ask once — or default to `--uncommitted` if there are uncommitted changes, otherwise `--base main` (or the repo's default branch).

## Passing the review prompt

- If the user typed `/codex:review <text>`, use `<text>` as the review instructions.
- If they said "have Codex review this", pass a short prompt describing what to focus on ("check for correctness bugs and race conditions", "focus on the auth changes", etc.). An empty prompt is legal — Codex will do a generic review — but a focused prompt gives better results.
- Codex has no memory of this Claude conversation. Include specifics (file paths, what the change is meant to do, known constraints) in the prompt.

## After the review

Summarize Codex's findings in your own words, grouped by severity or file. Cite specific file:line references from Codex's output. Do not paste the entire transcript.

If Codex flags something Claude has already discussed with the user or already decided against, note that briefly — don't re-litigate.

## When NOT to use this skill

- The user wants Codex to *fix* what it finds → use `codex:implement` instead (or run this first and then `codex:implement` with the findings as the prompt).
- The user wants Claude's own review, not Codex's second opinion → use the `code-review` skill.
- The target isn't a git repo → this skill needs one. Ask the user, or use `codex:implement` in read-only mode with `-s read-only`.
