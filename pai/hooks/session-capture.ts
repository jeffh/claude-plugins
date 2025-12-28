#!/usr/bin/env bun
/**
 * PAI Session Capture Hook
 *
 * Captures SessionStart and SessionEnd events for the PAI history system.
 * Logs session metadata to ~/.claude/pai-history/sessions/
 *
 * Events: SessionStart, SessionEnd
 */

import { join } from "path";
import {
  type SessionStartInput,
  type SessionEndInput,
  type SessionEntry,
  type HookOutput,
  HISTORY_PATHS,
  readStdin,
  getDateString,
  getTimestamp,
  ensureDir,
  appendJsonl,
} from "./types";

// Track session start time for duration calculation
const sessionStartTimes: Map<string, number> = new Map();

async function handleSessionStart(input: SessionStartInput): Promise<void> {
  // Record start time
  sessionStartTimes.set(input.session_id, Date.now());

  // Ensure directory exists
  await ensureDir(HISTORY_PATHS.sessions);

  // Create session entry
  const entry: SessionEntry = {
    timestamp: getTimestamp(),
    event: "start",
    session_id: input.session_id,
    source: input.source,
    cwd: input.cwd,
    transcript_path: input.transcript_path,
  };

  // Write to date-based session file
  const filename = `${getDateString()}.jsonl`;
  const filepath = join(HISTORY_PATHS.sessions, filename);
  await appendJsonl(filepath, entry);

  // Log to stderr for debugging (visible with --debug)
  console.error(`[PAI] Session started: ${input.session_id} (${input.source})`);
}

async function handleSessionEnd(input: SessionEndInput): Promise<void> {
  // Calculate duration if we have start time
  const startTime = sessionStartTimes.get(input.session_id);
  const duration_ms = startTime ? Date.now() - startTime : undefined;
  sessionStartTimes.delete(input.session_id);

  // Ensure directory exists
  await ensureDir(HISTORY_PATHS.sessions);

  // Create session entry
  const entry: SessionEntry = {
    timestamp: getTimestamp(),
    event: "end",
    session_id: input.session_id,
    cwd: input.cwd,
    transcript_path: input.transcript_path,
    duration_ms,
  };

  // Write to date-based session file
  const filename = `${getDateString()}.jsonl`;
  const filepath = join(HISTORY_PATHS.sessions, filename);
  await appendJsonl(filepath, entry);

  // Log to stderr for debugging
  const durationStr = duration_ms
    ? ` (duration: ${Math.round(duration_ms / 1000)}s)`
    : "";
  console.error(`[PAI] Session ended: ${input.session_id}${durationStr}`);
}

async function main(): Promise<void> {
  try {
    const inputText = await readStdin();
    const input = JSON.parse(inputText) as SessionStartInput | SessionEndInput;

    if (input.hook_event_name === "SessionStart") {
      await handleSessionStart(input as SessionStartInput);
    } else if (input.hook_event_name === "SessionEnd") {
      await handleSessionEnd(input as SessionEndInput);
    }

    // Return empty output - we don't need to modify anything
    const output: HookOutput = {};
    console.log(JSON.stringify(output));
    process.exit(0);
  } catch (error) {
    console.error(
      `[PAI] Session capture error: ${error instanceof Error ? error.message : String(error)}`
    );
    // Exit 0 to not block - logging failures shouldn't stop the session
    process.exit(0);
  }
}

main();
