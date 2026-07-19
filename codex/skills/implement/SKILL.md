---
name: implement
model: claude-sonnet-5
effort: low
argument-hint: "[--model <gpt-model>] [--effort <level>] <task to implement>"
description: Delegate a coding task to a Codex subagent (GPT 5.6 Sol by default) that writes files directly in the working directory. Use when the user wants Codex — or "GPT-5.5" — to build, implement, write, add, refactor, fix, or otherwise change code, whether they say "have Codex do X", "get Codex to…", "hand this to Codex", or type `/codex:implement`. Do NOT use for read-only code review where Codex inspects a diff, branch, PR, or commit without editing (use codex:review); for driving desktop or browser UI (use codex:computer); when the user wants Claude to make the change itself rather than delegate; or for a trivial edit Claude can just do in one step.
---

# Codex Implement

Delegate an implementation task to a Codex subagent running **GPT 5.6 Sol** (or another GPT model the user names). The subagent will edit files in the current working directory.

## Choosing the model

The `-m` flag selects the model. Default to `gpt-5.6-sol`, but honor any specific model the user asks for:

- Use `gpt-5.6-sol` unless the user names a different model.
- If the user specifies a model — e.g. "run gpt-5.6-terra", "use gpt-5.5-codex", "with the `<name>` model" — pass that exact string to `-m` instead. Don't validate or second-guess the name; Codex will error if it's unknown.
- If they typed `/codex:implement --model <name> <task>` (or `-m <name>`), strip that flag from the prompt and use `<name>` as the model.

## Choosing the effort

Reasoning effort is set with `-c model_reasoning_effort="<level>"`. Default to `high`, but honor any level the user asks for:

- Use `high` unless the user names a different level.
- If the user asks in prose — e.g. "low effort", "medium effort" — substitute that level.
- If they typed `/codex:implement --effort <level> <task>`, strip that flag from the prompt and use `<level>` as the effort.

Everywhere below shows `-m gpt-5.6-sol` and high effort; substitute the chosen model and effort.

## How to invoke

1. Take the user's prompt (either the `args` passed to this skill, or the surrounding request if they said "have Codex do X").
2. Run the Bash tool with:

   ```
   codex exec \
     -m gpt-5.6-sol \
     -c model_reasoning_effort="high" \
     -s workspace-write \
     --skip-git-repo-check \
     -C "$PWD" \
     "<PROMPT>"
   ```

   - `-m gpt-5.6-sol` — the model; default `gpt-5.6-sol`, or the model the user named (see [Choosing the model](#choosing-the-model)).
   - `-c model_reasoning_effort="high"` — reasoning effort; default `high`, or the level the user named (see [Choosing the effort](#choosing-the-effort)).
   - `-s workspace-write` — Codex may write files under the workdir + `$TMPDIR`; this is the safe default. `codex exec` runs non-interactively with approval mode `never` (there is no `-a`/`--ask-for-approval` flag), so Codex cannot prompt to escalate — it simply stays within the sandbox. Only switch to `--dangerously-bypass-approvals-and-sandbox` if the user explicitly asks for autonomous, unsandboxed execution.
   - `-C "$PWD"` — pin the workspace to Claude's current directory.
   - `--skip-git-repo-check` — allow running outside a git repo. Drop this if the user's task is git-related.
   - **Always set an explicit Bash `timeout`.** Implementation runs are slow and the Bash default (120000 ms / 2 min) will kill Codex mid-run. Pass `timeout: 600000` (10 min — the maximum the Bash tool allows) on every `codex exec` call.
   - If the task is large enough that even 10 minutes may not be enough, run the Bash call with `run_in_background: true` instead and poll its output rather than blocking — a foreground call cannot exceed the 600000 ms cap.

3. Quote the prompt safely. For multi-line prompts, pipe via stdin instead:

   ```bash
   codex exec -m gpt-5.6-sol -c model_reasoning_effort="high" -s workspace-write --skip-git-repo-check -C "$PWD" - <<'EOF'
   <PROMPT>
   EOF
   ```

4. After Codex finishes, briefly summarize what it changed (from its stdout tail and, if useful, `git status` / `git diff`). Do not paste Codex's full transcript back to the user.

## Passing prompts

- If the user typed `/codex:implement <text>`, use `<text>` verbatim as the prompt.
- If the user said "have Codex implement X", assemble a clear self-contained prompt describing the task, relevant files, and constraints — Codex has no memory of this Claude conversation.
- Include specific file paths and function names when known. Codex will explore, but a targeted prompt is faster and cheaper.

## What Codex sees

Codex starts fresh in `$PWD` with no context from this conversation. Anything Claude has already figured out (file paths, decisions, constraints) must be in the prompt or Codex will re-discover it.

## When NOT to use this skill

- The user wants a code review with no changes → use `codex:review`.
- The user wants Codex to click through UI or drive a browser → use `codex:computer`.
- The task is trivial and Claude can do it directly in one edit → just do it; don't spawn a subagent.
