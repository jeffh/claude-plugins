---
name: computer
model: claude-sonnet-5
effort: low
argument-hint: "[--model <gpt-model>] [--effort <level>] <UI task to perform>"
description: Delegate a desktop or browser UI task to a Codex subagent (GPT 5.6 Sol by default) using Computer Use, where it reads the Mac screen and drives apps by clicking, typing, and scrolling. Use when the user wants Codex — or "GPT-5.5" — to operate a GUI app such as Chrome, Slack, Finder, Xcode, Figma, System Settings, or a website form, whether they say "have Codex click/open/fill/drag…" or type `/codex:computer`. Do NOT use for code or file work (use codex:implement to change code, codex:review to review it); prefer Claude's own Chrome tools for browser-only tasks when available. Flag risky real-world actions (sending messages, purchases, entering credentials) before invoking.
---

# Codex Computer Use

Delegate a **desktop UI** task to a Codex subagent running **GPT 5.6 Sol** (or another GPT model the user names) with Codex's Computer Use feature. The subagent will take screenshots and drive the Mac by clicking, typing, and scrolling.

## Choosing the model

The `-m` flag selects the model. Default to `gpt-5.6-sol`, but honor any specific model the user asks for:

- Use `gpt-5.6-sol` unless the user names a different model.
- If the user specifies a model — e.g. "drive it with gpt-5.6-terra", "use the `<name>` model" — pass that exact string to `-m` instead. Don't validate or second-guess the name; Codex will error if it's unknown. Note the model must support Computer Use; if it doesn't, the run will fail and you should report that back.
- If they typed `/codex:computer --model <name> <task>` (or `-m <name>`), strip that flag from the prompt and use `<name>` as the model.

## Choosing the effort

Reasoning effort is set with `-c model_reasoning_effort="<level>"`. Default to `low` for Computer Use — each action is a screenshot + reasoning cycle, and low effort keeps the loop fast. Honor any level the user asks for:

- Use `low` unless the user names a different level.
- If the user asks in prose — e.g. "high effort" — substitute that level.
- If they typed `/codex:computer --effort <level> <task>`, strip that flag from the prompt and use `<level>` as the effort.

The command below shows `-m gpt-5.6-sol` and low effort; substitute the chosen model and effort.

## Before invoking — confirm intent

Computer Use has real-world side effects (sending messages, making purchases, changing settings). Before spawning the subagent:

- Confirm the task is genuinely a GUI task, not something better done via CLI or code.
- If the task could touch sensitive scopes — sending messages, transmitting personal data, deleting cloud data, submitting forms, entering passwords, installing software, changing system settings — surface that risk to the user and get explicit approval **before** invoking. Because the run bypasses approvals and the sandbox (see below), Codex will **not** stop to confirm risky steps mid-run — Claude's up-front confirmation is the only gate, so build any "don't do X without confirming" constraint into the prompt itself.
- The Codex Computer Use app must be present at `~/.codex/computer-use/Codex Computer Use.app`. If it's missing, tell the user to install it via the Codex desktop app (`codex app`).

## How to invoke

Codex Computer Use runs as a spawned macOS helper app that the Codex agent drives. Invoke Codex with the feature enabled and approvals+sandbox bypassed — `codex exec` runs non-interactively with approval mode `never`, so any prompt-on-request path auto-**denies**, and Computer Use will fail with "approval denied" when it tries to attach to an app. Bypassing is required for Codex to drive the UI autonomously:

```
codex exec \
  -m gpt-5.6-sol \
  -c model_reasoning_effort="low" \
  --enable computer_use \
  --dangerously-bypass-approvals-and-sandbox \
  --skip-git-repo-check \
  -C "$PWD" \
  "<PROMPT>"
```

- `-m gpt-5.6-sol` — the model; default `gpt-5.6-sol`, or the model the user named (see [Choosing the model](#choosing-the-model)). Must support Computer Use.
- `-c model_reasoning_effort="low"` — reasoning effort; default `low` for Computer Use (see [Choosing the effort](#choosing-the-effort)).
- `--enable computer_use` — explicitly turn on the Computer Use skill (default is on, but be explicit).
- `--dangerously-bypass-approvals-and-sandbox` — **required** in `codex exec`. Because exec's approval mode is `never`, Computer Use cannot ask for on-request approval; without this flag it auto-denies attaching to any app ("approval denied") and also hits a profile-access error. This flag lets Codex drive the UI autonomously (there is no `-a on-request` in this CLI). Since it grants fully-autonomous UI control with no per-action confirmation, confirm the user has authorized it before invoking, and hold back the run for genuinely risky tasks (see below).
- **Always set an explicit Bash `timeout`.** Computer Use runs are especially slow because each action is a screenshot + reasoning cycle, and the Bash default (120000 ms / 2 min) will kill the run after just a few clicks. Pass `timeout: 600000` (10 min — the maximum the Bash tool allows) on every call. Multi-step UI tasks routinely exceed 10 minutes, so for anything beyond a couple of actions run the Bash call with `run_in_background: true` and poll its output — a foreground call cannot exceed the 600000 ms cap.

## Writing the prompt

- Codex has no memory of this Claude conversation. State the goal, the starting app or URL, any credentials the user has already logged in to, and the definition of "done."
- Be explicit about constraints ("don't send the email until I confirm", "read-only — don't click any buttons", "only look at the currently-open window").
- If the task involves a specific app, name it exactly ("Google Chrome", "Slack", "Xcode 15").
- Codex will need the app in the foreground or launchable — mention if it needs to be opened first.

## After the run

Summarize what Codex actually did (from its stdout), including any screenshots or confirmations. Highlight anything Codex confirmed with the user mid-run and anything it declined to do. Don't paste the full transcript.

## When NOT to use this skill

- The task is in code/files, not UI → use `codex:implement` (implement) or `codex:review`.
- The task is browser-only and Claude has the `mcp__claude-in-chrome__*` tools → prefer driving Chrome directly from Claude; that keeps the user's approvals in one place.
- The task is something the user should do themselves (financial transactions, legally binding submissions, credential entry) → hand off to the user rather than automating.
