// A compact SM-2 spaced-repetition scheduler (the SuperMemo-2 algorithm).
// Pure functions so they run identically on client and server. The Learn loop
// stores one SrsState per flashcard in localStorage.

export interface SrsState {
  ease: number; // ease factor, starts 2.5
  intervalDays: number; // current interval
  reps: number; // successful reps in a row
  dueAt: number; // epoch ms when the card is next due
}

/** Quality of recall, SM-2 scale: 0 (blackout) … 5 (perfect). */
export type Grade = 0 | 1 | 2 | 3 | 4 | 5;

const DAY = 24 * 60 * 60 * 1000;

export function initSrs(now: number): SrsState {
  return { ease: 2.5, intervalDays: 0, reps: 0, dueAt: now };
}

export function review(state: SrsState, grade: Grade, now: number): SrsState {
  // Failed recall (< 3): reset the streak, show again soon.
  if (grade < 3) {
    return {
      ease: Math.max(1.3, state.ease - 0.2),
      intervalDays: 0,
      reps: 0,
      dueAt: now + 60 * 1000, // ~1 minute — re-drill this session
    };
  }

  const ease = Math.max(
    1.3,
    state.ease + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02)),
  );
  const reps = state.reps + 1;

  let intervalDays: number;
  if (reps === 1) intervalDays = 1;
  else if (reps === 2) intervalDays = 6;
  else intervalDays = Math.round(state.intervalDays * ease);

  return { ease, intervalDays, reps, dueAt: now + intervalDays * DAY };
}

export function isDue(state: SrsState, now: number): boolean {
  return state.dueAt <= now;
}
