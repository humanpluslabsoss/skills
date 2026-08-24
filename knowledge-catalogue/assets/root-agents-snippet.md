<!-- Paste into the repo's canonical root agent-instruction file. Keep this
     short: it is loaded on every task, so it should point rather than explain. -->

## Knowledge catalogue

- Durable implemented conventions and operational facts live in the
  [knowledge catalogue](docs/knowledge/index.md). Start at its index and load
  only the smallest relevant set of concepts; follow the
  [authoring rules](docs/knowledge/AGENTS.md) when changing it.
- Keep unshipped decisions in plans/PRDs, architectural decision history in
  ADRs, and established conceptual models in their existing canonical docs.
  Promote knowledge only after implementation makes it true.
- Treat disagreement between code and a concept as drift. Accepted ADRs and
  root architectural boundaries remain authoritative until superseded.
