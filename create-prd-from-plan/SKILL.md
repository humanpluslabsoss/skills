---
name: create-prd-from-plan
description: Turn a plan into an agent-executable PRD plus a per-PRD conventions reference. Use when the user wants a plan broken into self-contained milestones that fresh agent sessions can implement against.
disable-model-invocation: true
---

# Create PRD from plan

**Usage:** `/create-prd-from-plan [path-to-plan]`

Turn a plan (and the decisions made in the conversation around it) into two
documents an agent can implement against:

- `docs/prds/<plan-slug>/prd.md` — milestones, each a self-contained task
  checklist with acceptance criteria.
- `docs/prds/<plan-slug>/conventions.md` — the agreed **in-flight** conventions
  for greenfield work (areas with no existing pattern). Ephemeral: durable entries
  are promoted into the knowledge base (`docs/knowledge/`) when the PRD is retired.

This skill **produces documents only — it does not implement.** Implementation
happens later, in separate sessions, against these docs.

## Why this exists

Two kinds of drift to guard against:

1. Agents writing code that doesn't match how the user wants it written.
2. The plan itself carrying implementation details the user would override.

The defence for both: **defer to the knowledge base (`docs/knowledge/`) and
existing repo patterns where they exist; for genuinely greenfield work, follow
the conventions doc** agreed with the user up front.

## Minimum-change rule

Prefer the smallest change that satisfies the plan's explicit outcome. Find the
closest working implementation and extend it in place; an incomplete
implementation is an existing route, not greenfield work. Do not add a
dependency, abstraction, shared layer, stronger guarantee or optional hardening
unless the existing route demonstrably cannot meet an acceptance criterion.
Record that evidence and get explicit approval. Existing repo patterns are the
default, not one option among equally weighted alternatives.

## The fresh-session rule (drives everything)

Each milestone must be implementable in a **brand-new session** that has only
these two docs, the knowledge base, plus the repo — never this planning
conversation.

So **every currently binding decision and override from the plan and this
conversation must be written into the docs.** Superseded or optional ideas must
not become implementation requirements. Anything binding left only in chat is
lost to the implementing agent. This is what makes orchestrator/sub-agent and
"loop over the next incomplete milestone" patterns work.

"Self-contained" means the _set_ {PRD header + the one milestone +
conventions.md + the knowledge base + repo} is sufficient. Shared rules live once
in the header, the KB, and the conventions doc; milestones point to them rather
than repeating them.

## Process

Work through these in order. Don't skip the scan or the docs research — they're
what keep the interview short and the output grounded.

### 1. Resolve inputs

- The plan: read the path in `$ARGUMENTS` if given; otherwise find the plan
  referenced in the conversation and read it in full.
- Re-read the conversation for currently binding decisions, overrides and
  constraints that refine the plan. Note superseded or optional ideas separately
  so they do not become tasks.
- Read `AGENTS.md` / `AGENTS.md`. Don't re-litigate anything already settled
  there; treat it as given.
- Read the knowledge base index (`docs/knowledge/index.md`) and skim the concept
  docs the plan touches. The KB is the repo-wide convention store — treat its
  entries as given, the same as `AGENTS.md`.
- Derive `<plan-slug>` from the plan filename. Outputs go to
  `docs/prds/<plan-slug>/`.

### 2. Scan the repo for patterns

For every area the plan touches, classify it (check the KB first):

- **Already in the KB** — a `docs/knowledge/` concept already covers it. Not
  greenfield: cite the concept ID; don't re-interview or restate it.
- **Extend existing route** — a current operation, tool, prompt or workflow
  already does part of the job. Record its path, limitation and minimum delta.
  Expand it in place; it does **not** need a conventions decision.
- **Pattern exists elsewhere** — there's prior art elsewhere in the repo to copy.
  Record the example path(s). Agents follow it; it does **not** need an interview
  or a conventions decision, only a "follow `<path>`" pointer.
- **Greenfield** — neither an extendable route, the KB nor repo prior art can meet
  an explicit acceptance criterion. Record why the existing route fails. Only
  these unavoidable gaps become interview targets and conventions entries.
- **Watch for overlap:** when an area pulls in a new dependency, check whether
  the repo already provides an equivalent — including transitive deps and other
  runtimes (e.g. a second Postgres driver alongside one Mastra already bundles).
  An overlap is a decision to raise in the interview, not a silent addition.

Present the classification as a short table with `area`, `classification`,
`existing route`, `minimum delta` and `why new machinery is unavoidable`. Let
the user correct it before moving on. The last column should normally be empty.

### 3. Research current docs for greenfield dependencies

For each unavoidable greenfield area involving a dependency or tool,
**retrieve up-to-date official documentation** — do not rely on memory; versions
and recommended patterns drift. Do not research optional stronger designs or
new machinery that the minimum change does not require.

- Primary: the Ref MCP (`ref_search_documentation`, then `ref_read_url`).
- Fallback: `WebSearch` + `WebFetch`.

From the docs, build an explicit list of **decision forks within the selected
minimum route** — don't just capture "the recommended pattern":

- Anywhere the library offers **more than one legitimate approach** (e.g.
  Drizzle's `postgres-js` vs `node-postgres` adapters, driver/pooling modes,
  config strategies), record **both** options and their trade-offs — even when
  one looks like the obvious default.
- Anywhere a new dependency **overlaps something the repo already uses** (from
  the step-2 scan), record that as a fork too.
- The plan's stated choice and the docs' headline recommendation are a
  **candidate default to put to the user, not a settled decision.** A
  recommendation is not a resolution.

Only forks that remain necessary after the minimum-change gate become questions
in step 4. A stronger or more general alternative is optional hardening, not a
fork, unless the user asks for it. Keep the doc URLs to cite in conventions.md.

### 4. Interview the user (`/grilling`)

Run a `/grilling` session, scoped to:

- **every necessary decision fork from step 3**, presented as a genuine choice — the
  options, their trade-offs, and any interaction with existing repo/runtime
  tooling — with your recommendation. Follow the existing repo route without a
  question when it meets the requirement; make the user choose only when the
  remaining alternatives materially affect behaviour, cost, risk or irreversible
  structure;
- plan ambiguities that block the minimum implementation, not speculative
  details or optional hardening;
- the milestone breakdown (see step 6).

One question at a time. Where a question can be answered by exploring the repo,
explore instead of asking. Continue until there's shared agreement on the
conventions and the milestones.

Before the interview, state the minimum route and list stronger options as out of
scope. Before writing, repeat the final delta: `Existing code: X. Required
change: Y. Everything else is out of scope.` If the accumulated design is
stronger than the outcome requires, ask the user to approve the reduced scope.

### 5. Write `conventions.md`

Use [conventions-template.md](conventions-template.md). Capture **only**
unavoidable greenfield decisions agreed in the interview, plus a pointer list of the
existing patterns agents must follow — for any already in the KB, link the
concept rather than restating it (don't let the doc drift from the catalogue).
Do not create a convention for a one-off extension that follows local prior art.
For any **forked** decision, record the **alternative(s) considered and why they
were rejected** — including any trade-off accepted (e.g. a second driver in the
runtime) — so the choice reads as deliberate and an implementing agent never has
to re-litigate it. Flag any entry that should outlive this PRD as **Promote to
KB** — this doc is ephemeral; `docs/knowledge/` is the long-lived home. (The
alternatives/history captured here are ephemeral too: on promotion they're
distilled to current-truth, not copied into the KB as a decision log.)

### 6. Write `prd.md`

Use [prd-template.md](prd-template.md).

- **Milestones as vertical slices** where the work allows — each a complete
  slice of functionality, not a horizontal layer.
- Default to one milestone for a contained change; implementation and its tests
  belong in the same slice. Add milestones only at genuine green, releasable
  boundaries.
- Where the work is inherently layered/infra and won't slice vertically, fall
  back to thin sequential milestones **and state that reasoning in the
  milestone.**
- Every milestone carries its `Depends on`, `Preconditions` (repo state as
  facts), `Context pointers`, `Tasks`, and `Definition of done` — see the
  template. All currently binding plan + conversation decisions must be
  captured. Keep optional hardening and unapproved new machinery out of tasks.
- Add a **Manual ops (human-only)** section if any work needs external services
  or secrets a coding agent can't configure (Neon, Doppler, Vercel, GitHub
  secrets) — list them so milestones can point there and the implementing agent
  surfaces rather than attempts them.
- Carry conventions' **Promote to KB** entries into the PRD's "Durable
  conventions to promote" note so they're moved into `docs/knowledge/` before
  this ephemeral doc is retired with the PRD.

### 7. Confirm

Present both docs for review. Do not implement.
