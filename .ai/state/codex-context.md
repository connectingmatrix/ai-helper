# Codex Context: ai-helper

## Current Repo State

- Repo path: `giga/ai-helper`
- Branch: `main`
- HEAD: `ff19de3693aab13d559cc3b219f6b7ca54f8d66d`
- Dirty files: 6

## Required Preflight

- Read `AGENTS.md`
- Use stored patterns and decisions before proposing changes
- Run `./.ai/bin/ai-sync` after meaningful work
- Run `./.ai/bin/ai-repair` for broken states or failed validation

## Validation Commands

- `yarn build`

## Architectural Context Inputs

- `AGENTS.md`
- `README.md`

## Current Worktree

- `M README.md`
- ` M src/normalize-utils.ts`
- `?? .ai/`
- `?? .continue/`
- `?? AGENTS.md`
- `?? src/workflow/value-utils.ts`

## Recent Commits

- ff19de3 Add shared safe/normalize/graphql utility exports
- 41c5f4c feat(workflow): add shared value parsing helpers
- 496a66a chore: stop tracking dist artifacts
- 1ab7a91 feat: move workflow model execution helpers into workflow runtime utils
- 74488eb Merge pull request #1 from connectingmatrix/codex/workflow-runtime-logger

## Architecture Context

File: README.md

# giga-ai-helper

TypeScript helper module extracted from `helper.ts` and split into focused utility chunks.

## Install (from GitHub)

```bash
yarn add git+ssh://git@github.com/connectingmatrix/giga-ai-helper.git
```

## Build

```bash
yarn install
yarn build
```

## Exports

- Types: `Nullable`, `JsonObject`, `StringLike`, `MimeFileLike`, `BinaryFileLike`
- MIME constants and derived lists/maps
- String, tag, JSON, file, vector, scoring, number, path, and action utilities
- Auth service exports from `src/services/auth` are available at:

```ts
import { login, signup, verifyOtp } from 'giga-ai-helper/giga-auth';
```

- Chunking exports are available at:

```ts
import { chunkText, ChunkUnit, ChunkingOptions } from 'giga-ai-helper/chunking';
```

- Embedding exports are available at:

```ts
import { createEmbedding, createEmbeddings, EmbeddingVector } from 'giga-ai-helper/embeddings';
```

- SERP search exports are available at:

```ts
import { searchSerpWeb, SerpSearchResponse } from 'giga-ai-helper/serp-search';
```

- Workflow runtime/logger exports are available at:

```ts
import {
  createJsonlWorkflowLogger,
  logNodeStarted,
  logNodeFinished,
  parseRecordValue,
  parseHeaderRecord,
} from 'giga-ai-helper/workflow';
```

## Normalize helper

Use `normalize` to map incoming records into class-shaped objects with implicit key normalizing and safe type coercion.

```ts
import { normalize, NormalizeField } from 'giga-ai-helper';

class OrgRestriction {
  organizationId: string | null = null;
  userId: string | null = null;
  reason: string | null = null;

  @NormalizeField('created_at')
  createdAt: string | null = null;
}

const normalized = normalize(row, OrgRestriction);
```

By default:
- string fields are trimmed and become `null` when empty/invalid (`toOptional
...

File: AGENTS.md

<!-- managed-by: PortableCoder -->

# AGENTS.md

## Working Agreement

- Codex Studio is the authoritative control surface for this repo.
- Continue + Ollama are secondary helpers and must follow the same repo rules and memory.
- Before major edits, read this file and run `./.ai/bin/ai-context`.
- Read `.ai/state/architecture-context.md` when the repo has system docs, context corpora, or script-based generators.
- When docs or generated context are stale, run `./.ai/bin/ai-context-build` before deeper implementation work.
- Keep the PortableCoder brain as the default route. Any Codex-backed execution must be explicitly unlocked for the current thread with `/brain allow codex`.
- After meaningful changes, run `./.ai/bin/ai-sync`.
- After prompt, standards, or memory updates, run `./.ai/bin/ai-memory-build`.
- On failures or broken validation, run `./.ai/bin/ai-repair`.
- If local-model features fail, run `cd /Users/abeer/dev/PortableCoder && ./tools/brain doctor` first.

## Repo Standards

- Prefer the smallest correct change over broad refactors.
- Preserve the repo's existing style, structure, and package manager.
- Avoid destructive git commands unless explicitly requested.
- Keep memory entries concise, factual, and tied to the files or behavior that changed.

## Repair Rules

- Inspect the latest failure memory before changing code.
- Inspect the latest summaries, patterns, and decisions before proposing a fix.
- Prefer minimal fixes that align with stored decisions and existing patterns.
- Record root cause, fix path, and validation outcome after repair work.

## Validation Expectations

- `yarn build`

## Memory Usage Rules

- Summaries belong in shared project memory after meaningful work.
- Failures must capture symptom, root cause, attempted fix, and validation
...

## Latest Memory

---
id: ai-helper--ec6b735c-20260325T095720Z-summary
type: summary
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:57:20.611Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Synchronized Codex thread 019d2452-c699-7603-953f-ca7109ce705a into shared project memory.
tags: codex-sync, session-sync
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session sync

Codex session `019d2452-c699-7603-953f-ca7109ce
...

---
id: ai-helper--ec6b735c-20260325T095719Z-summary
type: summary
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:57:19.415Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Synchronized current repo state into shared project memory.
tags: sync
files: EADME.md, src/normalize-utils.ts, .ai/, .continue/, AGENTS.md, src/workflow/value-utils.ts
relatedCommit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
---

# Auto sync summary

PortableCoder synchronized the current repo state.

- Changed files: EADME.md, src/normalize-utils.ts, .ai/, .continue/, AGENTS.md, src/workflow/v
...

---
id: ai-helper--ec6b735c-20260325T095627Z-summary
type: summary
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:56:27.993Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Synchronized Codex thread 019d2452-c699-7603-953f-ca7109ce705a into shared project memory.
tags: codex-sync, session-sync
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session sync

Codex session `019d2452-c699-7603-953f-ca7109ce
...

---
id: ai-helper--ec6b735c-20260325T095626Z-summary
type: summary
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:56:26.847Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Synchronized current repo state into shared project memory.
tags: sync
files: EADME.md, src/normalize-utils.ts, .ai/, .continue/, AGENTS.md, src/workflow/value-utils.ts
relatedCommit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
---

# Auto sync summary

PortableCoder synchronized the current repo state.

- Changed files: EADME.md, src/normalize-utils.ts, .ai/, .continue/, AGENTS.md, src/workflow/v
...

## Latest Failure Memory

No failure memory recorded yet.

## Latest Transcript Memory

---
id: ai-helper--ec6b735c-20260325T095720Z-transcript
type: transcript
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:57:20.452Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured the complete chronological user and Codex conversation for this thread.
tags: codex-sync, transcript
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex thread transcript

Codex thread transcript for `019d2452-c699-7603-
...

---
id: ai-helper--ec6b735c-20260325T095627Z-transcript
type: transcript
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:56:27.837Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured the complete chronological user and Codex conversation for this thread.
tags: codex-sync, transcript
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex thread transcript

Codex thread transcript for `019d2452-c699-7603-
...

## Patterns

---
id: ai-helper--ec6b735c-20260325T095720Z-pattern
type: pattern
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:57:20.942Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured repeatable workflow patterns from the Codex thread.
tags: codex-sync, pattern
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session working patterns

- - Continue + Ollama are secondary helpers and must follow the same r
...

---
id: ai-helper--ec6b735c-20260325T095628Z-pattern
type: pattern
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:56:28.301Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured repeatable workflow patterns from the Codex thread.
tags: codex-sync, pattern
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session working patterns

- - Continue + Ollama are secondary helpers and must follow the same r
...

---
id: ai-helper--ec6b735c-20260325T095616Z-pattern
type: pattern
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:56:16.300Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured repeatable workflow patterns from the Codex thread.
tags: codex-sync, pattern
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session working patterns

- - Continue + Ollama are secondary helpers and must follow the same r
...

---
id: ai-helper--ec6b735c-20260325T095556Z-pattern
type: pattern
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:55:56.130Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured repeatable workflow patterns from the Codex thread.
tags: codex-sync, pattern
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session working patterns

- - Continue + Ollama are secondary helpers and must follow the same r
...

## Decisions

---
id: ai-helper--ec6b735c-20260325T095720Z-decision
type: decision
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:57:20.772Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured explicit working rules and approved defaults from the Codex thread.
tags: codex-sync, decision
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session decisions

- - Codex Studio is the authoritative control surface for 
...

---
id: ai-helper--ec6b735c-20260325T095628Z-decision
type: decision
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:56:28.147Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured explicit working rules and approved defaults from the Codex thread.
tags: codex-sync, decision
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session decisions

- - Codex Studio is the authoritative control surface for 
...

---
id: ai-helper--ec6b735c-20260325T095616Z-decision
type: decision
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:56:16.118Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured explicit working rules and approved defaults from the Codex thread.
tags: codex-sync, decision
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session decisions

- - Codex Studio is the authoritative control surface for 
...

---
id: ai-helper--ec6b735c-20260325T095555Z-decision
type: decision
project: ai-helper--ec6b735c
timestamp: 2026-03-25T09:55:55.974Z
branch: main
commit: ff19de3693aab13d559cc3b219f6b7ca54f8d66d
summary: Captured explicit working rules and approved defaults from the Codex thread.
tags: codex-sync, decision
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper</cwd>, /Users/abeer/dev/giga/ai-helper/src/normalize-utils.ts, /Users/abeer/dev/giga/ai-helper/src/safe-utils.ts
relatedCommit: 
---

# Codex session decisions

- - Codex Studio is the authoritative control surface for 
...
