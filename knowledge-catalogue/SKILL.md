---
name: knowledge-catalogue
description: Set up and maintain an agent-loadable Open Knowledge Format (OKF) catalogue under docs/knowledge/ for durable implemented conventions, data assets, and operational facts. Use for greenfield knowledge-base setup, after shipped work establishes reusable repo knowledge, or when reviewing and updating existing catalogue concepts. Keep in-flight decisions in plans/PRDs and architectural decision history in ADRs rather than duplicating them here.
---

# Knowledge catalogue (Open Knowledge Format)

Durable implemented repo knowledge lives one concept per file under
`docs/knowledge/`, using the
[Open Knowledge Format](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md).
A concept's ID is its path under that folder minus `.md` (for example,
`conventions/data-layer/migrations`).

Pick the flow that matches the situation.

## Read this first

A skill fires only when selected. A catalogue must also be discoverable during
ordinary repository work, so bootstrap installs a short pointer in the repo's
canonical root agent-instruction file. Without that pointer the catalogue can be
written and never read.

## Flow A — Bootstrap (no `docs/knowledge/` yet)

1. Create `docs/knowledge/index.md`, the root index. Its only frontmatter key is
   `okf_version: "0.2"`. It lists categories, not individual concepts, and tells
   readers to load only the smallest relevant part of the catalogue.
2. Create `docs/knowledge/AGENTS.md` from `assets/knowledge-agents.md`, adapting
   repository-specific examples, authority rules, and the check command. The
   repo now owns its authoring rules.
3. Add the pointer from `assets/root-agents-snippet.md` to the canonical root
   agent-instruction file. Prefer `AGENTS.md` when both it and a forwarding
   `CLAUDE.md` exist; do not duplicate the instructions.
4. Copy `assets/check-knowledge-links.mjs` to
   `scripts/check-knowledge-links.mjs`. It has no dependencies and assumes it is
   one directory below the repo root.
5. If a package manifest and CI workflow already exist, add a `check:knowledge`
   command and run it in CI. Otherwise, do not scaffold unrelated tooling solely
   for the catalogue; wire the check in when that repository infrastructure is
   created.
6. Do not pre-create empty categories. Create a category the first time a real
   concept needs it. Empty scaffolding falsely signals that useful knowledge is
   available.

Write only concepts already supported by shipped or otherwise verified
repository facts. Keep accepted architecture in its canonical ADR or conceptual
document and link to it when useful; do not mirror it into a second source of
truth.

## Flow B — Before building a feature

Read `docs/knowledge/index.md`, then the smallest relevant set of category
indexes and concepts. Follow links when the task crosses concepts, but do not
bulk-load the whole folder.

If a concept and the implementation disagree, treat that as drift rather than
automatically declaring either side correct:

- For implementation detail, verified shipped code normally wins; update the
  concept when the task authorizes documentation changes.
- For accepted ADRs and root architectural boundaries, the documented
  constraint wins until it is superseded; fix the code or create a superseding
  ADR rather than rewriting knowledge to legitimize a violation.
- When the task is read-only or the authority is unclear, report the discrepancy
  instead of changing either side.

## Flow C — After building a feature

Ask what a future agent needs that cannot be recovered cheaply and reliably from
the code. Place it according to its role:

| Where | What |
| --- | --- |
| Root `AGENTS.md` | Tiny, always-relevant global rules |
| `docs/decisions/` | Accepted architectural decisions, context, trade-offs, and supersession history |
| Existing product/domain docs | The canonical conceptual model or strategy already owned by that document |
| `docs/knowledge/` | Durable implemented conventions, data assets, and operational facts needed on demand |
| Plan/PRD docs | In-flight decisions for unshipped work; promote only what becomes durable after shipping |
| Nowhere | Detail already clear from code, types, tests, or another canonical source |

To add or update a concept, follow `docs/knowledge/AGENTS.md` in the repo, or
`assets/knowledge-agents.md` before bootstrap. The short version:

- Use OKF v0.2 frontmatter: `type` is required; always add `description` and
  `generated`. Use `sources`, `verified`, `status`, and `stale_after` accurately
  when they add useful provenance, trust, or lifecycle information.
- Describe current truth and a concise present-tense rationale. Decision history
  and rejected alternatives belong in ADRs.
- Point at code for volatile detail instead of mirroring lists that will rot.
- Use standard relative Markdown links, never wiki-link syntax.
- Add a one-line entry to the immediate category index, reusing `description`.
- Run the catalogue link check.

Editing beats adding. If a doc for the concept exists, update it; two partially
correct docs on one topic are worse than one maintained source.
