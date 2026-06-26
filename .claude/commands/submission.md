# /submission <event-name>

Draft or refine a competition submission. Routes to @submissions.

1. Read an existing pair in `docs/submissions/` (e.g. `futurehacks.md`) as the structural template.
2. Research the target event's theme, judging criteria, and prize tracks.
3. Pull verified claims only: live `/api/metrics`, `docs/EVALUATION.md`, `README.md`, the repo. No invented stats.
4. Write `docs/submissions/<event-name>.md` and `<event-name>-project-story.md`:
   problem → why it matters → demo → how it works (lead with the guardrail) → what's novel → what's next.
5. Thread the event's theme through the narrative explicitly.
6. Verify: every metric traces to a source; live URL + repo link present; theme addressed.
