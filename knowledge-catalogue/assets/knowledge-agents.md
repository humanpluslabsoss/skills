# Contributing to the knowledge catalogue

This catalogue uses
[Open Knowledge Format v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
plus the repository conventions below.

## What belongs here — and what doesn't

- **Here:** durable implemented knowledge an agent needs on demand—conventions,
  data assets, and operational facts that outlive a task and are not already
  canonical elsewhere.
- **In the root `AGENTS.md`:** tiny, always-relevant global rules.
- **In `docs/decisions/`:** accepted architectural decisions, their context and
  trade-offs, and supersession history.
- **In an existing product or domain document:** the conceptual model or
  strategy that document already owns. Update it in place instead of copying it.
- **In a plan or PRD:** in-flight decisions for work that has not shipped.
  Promote only the durable current truth after implementation proves it.
- **Nowhere:** detail already clear from code, types, tests, or another canonical
  source.

One concept lives in each file. Its concept ID is the path under this folder
minus `.md` (for example, `conventions/data-layer/migrations`).

## Authority and drift

When a concept disagrees with implementation, determine which source owns the
fact:

- Verified shipped code normally owns implementation detail.
- Root architectural boundaries and accepted ADRs remain authoritative until
  superseded. Do not rewrite a concept to legitimize violating code.
- Existing canonical product and domain docs keep ownership of their concepts.
- If authority is unclear, report the discrepancy before changing either side.

Fix the incorrect source when the task authorizes it, and avoid leaving two
conflicting descriptions behind.

## Structure

```text
docs/knowledge/
  index.md                     # lists categories only
  AGENTS.md                    # this file
  data/index.md                # a category index—lists its concepts
  data/<asset>.md
  conventions/index.md         # lists subcategories
  conventions/<area>/index.md  # lists its concepts
  conventions/<area>/<concept>.md
```

Create a category only when a real concept needs it. Do not scaffold empty
folders.

## Frontmatter

Every concept starts with YAML frontmatter:

```yaml
---
type: <Convention | Postgres Table | Architecture | ...>
title: <display name>
description: <one-line retrieval summary>
status: <draft | stable | deprecated>
generated:
  by: <producer/version | human:id | process:id>
  at: <ISO-8601 datetime with an explicit UTC offset>
verified:
  - by: <producer/version | human:id | process:id>
    at: <ISO-8601 datetime with an explicit UTC offset>
sources:
  - id: <stable-source-id>
    resource: <URL or relative path>
    title: <source title>
resource: <canonical URI for an underlying asset>
tags: [<tag>, <tag>]
stale_after: <ISO-8601 datetime with an explicit UTC offset>
---
```

OKF requires only `type`. This catalogue also requires `description` and
`generated` because retrieval and provenance are core to agent-maintained docs.

- `generated.at` records the last meaningful content change; update it when the
  concept's meaning changes.
- Omit `verified` unless the stated actor actually checked the concept against
  its source. Never infer human review from authorship or a pending PR.
- An absent `status` means `stable` in OKF. Use `draft` explicitly for content
  that is not ready to guide implementation.
- Use `stale_after` only when a fact has a meaningful expiry time.
- Use `sources` for material the concept derives from. Attribute individual
  claims with Markdown footnotes whose labels match `sources[].id` when needed.

The root `index.md` carries `okf_version: "0.2"` as its only frontmatter key.
Index files and this `AGENTS.md` are reserved files, not concepts, so they do not
carry concept frontmatter.

## Body rules

- **Current truth only.** Describe what is true now and how to work with it.
  Brief present-tense rationale and consequences are useful; decision history,
  alternatives, and supersession narratives belong in ADRs.
- **Point at code for volatile detail.** Reference an authoritative schema or
  type instead of mirroring columns or fields that will drift. Record the
  constraints and usage guidance the code cannot express by itself.
- **Use standard relative Markdown links.** This repository convention is
  intentionally stricter than OKF so links render consistently from a bundle
  nested inside the repo. Never use wiki-link syntax.
- Use conventional headings where they fit, including `# Schema` and
  `# Examples`. Provenance belongs in `sources`, not a legacy `# Citations`
  section.

## Template — convention

```markdown
---
type: Convention
title: <Short name>
description: <One line an agent can use to decide whether to open this file.>
status: <draft | stable | deprecated>
generated:
  by: <producer/version | human:id | process:id>
  at: <ISO-8601 datetime with an explicit UTC offset>
sources:
  - id: <stable-source-id>
    resource: <URL or relative path>
    title: <source title>
tags: [convention, <area>]
---

<State the current rule. Bullets beat prose.>

<Explain briefly what breaks if the rule is ignored.>

<Link to the authoritative code, ADRs, canonical docs, and neighbouring concepts.>
```

## Template — data asset

```markdown
---
type: <Postgres Table | Queue | Bucket | ...>
title: <asset name>
description: <What it holds and the primary rule governing it.>
status: <draft | stable | deprecated>
generated:
  by: <producer/version | human:id | process:id>
  at: <ISO-8601 datetime with an explicit UTC offset>
resource: <canonical URI>
sources:
  - id: <stable-source-id>
    resource: <URL or relative path>
    title: <source title>
tags: [data, <area>]
---

<What the asset is and why it exists.>

# Schema

Authoritative definition: <link to source>. Consult it for columns, types, and
defaults. Record here only what the source cannot express:

- <constraints, invariants, cascade behaviour, or gating rules>

# How to work with it

- <helpers to call and abstractions not to bypass>
```

## Workflow

1. Confirm the concept belongs here rather than in an ADR, plan/PRD, existing
   canonical doc, or nowhere.
2. Add or edit the concept under the narrowest useful category.
3. Add a one-line entry to the immediate category's `index.md`, reusing the
   concept's `description`. Parent indexes list only the level immediately below
   them.
4. Use real Markdown links for references that should be protected by the link
   checker. Backticked paths are examples or prospective targets and are not
   treated as links.
5. Run `node scripts/check-knowledge-links.mjs` and resolve every failure.
6. If the repository has a package-level `check:knowledge` command and CI
   integration, keep both green.

Prefer self-discovery through a package's own `AGENTS.md` over scattering
pointers through source files.

## Author checklist

- [ ] The concept records implemented current truth, not roadmap or decision history.
- [ ] Existing ADR and canonical-document authority is preserved.
- [ ] `type`, `description`, and `generated` are accurate.
- [ ] `verified`, `sources`, `status`, and `stale_after` do not overstate trust or freshness.
- [ ] One concept lives in the file.
- [ ] Volatile detail points to its authoritative source.
- [ ] The immediate category index reuses the concept description.
- [ ] The catalogue link check is green.
