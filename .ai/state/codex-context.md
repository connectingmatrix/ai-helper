# Codex Context: ai-helper

## Current Repo State

- Repo path: `giga/ai-helper`
- Branch: `main`
- HEAD: `e5ce4764869e2894e629380c6745883458ac5c16`
- Dirty files: 3

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

- `M .ai/state/codex-context.md`
- ` M .ai/state/retrieval.md`
- `?? ai-helper.zip`

## Recent Commits

- e5ce476 fix: preload pdf worker for uploads
- 64e36bd fix: pin pdf worker path for uploads
- 8614d12 fix: destroy pdf parser after extraction
- 4dc253a chore: sync pending workspace changes
- 2d2d223 Fixes

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
import { normalize } from 'giga-ai-helper';

class OrgRestriction {
  organizationId: string | null = null;
  userId: string | null = null;
  reason: string | null = null;
  createdAt: string | null = null;
}

const normalized = normalize(row, OrgRestriction);
```

By default:
- string fields are trimmed and become `null` when empty/invalid (`toOptionalString` behavior)
- boolean fields are normalized
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
- When a written plan is implemented, export that plan markdown to `~/dev/codex-plan/ai-helper/[PLAN HEADING]-DATE-.md` and keep the original plan date in frontmatter and file timestamps.
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

## Validation Expect
...

## Latest Memory

---
id: ai-helper--ec6b735c-20260410T175804Z-summary
type: summary
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:58:04.595Z
branch: main
commit: 64e36bde4c58ffb94f220e4d6809088d6e5b1810
summary: Synchronized Codex thread 019d5e21-35b0-79a0-b904-d3f698e4faf7 into shared project memory.
tags: codex-sync, session-sync
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/
...

---
id: ai-helper--ec6b735c-20260410T175803Z-summary
type: summary
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:58:03.363Z
branch: main
commit: 64e36bde4c58ffb94f220e4d6809088d6e5b1810
summary: Synchronized current repo state into shared project memory.
tags: sync
files: ai/state/codex-context.md, .ai/state/retrieval.md, src/file-utils.ts, src/pdf-worker.d.ts
relatedCommit: 64e36bde4c58ffb94f220e4d6809088d6e5b1810
---

# Auto sync summary

PortableCoder synchronized the current repo state.

- Changed files: ai/state/codex-context.md, .ai/state/retrieval.md, src/file-utils.ts, src/pdf-
...

---
id: ai-helper--ec6b735c-20260410T175351Z-summary
type: summary
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:53:51.434Z
branch: main
commit: 8614d1244781454e1f49f709f8073a3943619d3e
summary: Synchronized Codex thread 019d5e21-35b0-79a0-b904-d3f698e4faf7 into shared project memory.
tags: codex-sync, session-sync
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/
...

---
id: ai-helper--ec6b735c-20260410T175350Z-summary
type: summary
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:53:50.701Z
branch: main
commit: 8614d1244781454e1f49f709f8073a3943619d3e
summary: Synchronized current repo state into shared project memory.
tags: sync
files: ai/state/codex-context.md, .ai/state/retrieval.md, src/file-utils.ts
relatedCommit: 8614d1244781454e1f49f709f8073a3943619d3e
---

# Auto sync summary

PortableCoder synchronized the current repo state.

- Changed files: ai/state/codex-context.md, .ai/state/retrieval.md, src/file-utils.ts
- Branch: main
- HEAD: 8614d12
...

## Latest Failure Memory

No failure memory recorded yet.

## Latest Transcript Memory

---
id: ai-helper--ec6b735c-20260410T175804Z-transcript
type: transcript
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:58:04.435Z
branch: main
commit: 64e36bde4c58ffb94f220e4d6809088d6e5b1810
summary: Captured the complete chronological user and Codex conversation for this thread.
tags: codex-sync, transcript
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/file-u
...

---
id: ai-helper--ec6b735c-20260410T175351Z-transcript
type: transcript
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:53:51.335Z
branch: main
commit: 8614d1244781454e1f49f709f8073a3943619d3e
summary: Captured the complete chronological user and Codex conversation for this thread.
tags: codex-sync, transcript
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/file-u
...

## Patterns

---
id: ai-helper--ec6b735c-20260410T175804Z-pattern
type: pattern
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:58:04.820Z
branch: main
commit: 64e36bde4c58ffb94f220e4d6809088d6e5b1810
summary: Captured repeatable workflow patterns from the Codex thread.
tags: codex-sync, pattern
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/file-utils.ts, /Users/abeer/dev/gig
...

---
id: ai-helper--ec6b735c-20260410T175351Z-pattern
type: pattern
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:53:51.630Z
branch: main
commit: 8614d1244781454e1f49f709f8073a3943619d3e
summary: Captured repeatable workflow patterns from the Codex thread.
tags: codex-sync, pattern
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/file-utils.ts, /Users/abeer/dev/gig
...

---
id: ai-helper--ec6b735c-20260410T174326Z-pattern
type: pattern
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:43:26.441Z
branch: main
commit: 4dc253a480eeb4af8cc6f98d6e4ab9337642b4cf
summary: Captured repeatable workflow patterns from the Codex thread.
tags: codex-sync, pattern
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/file-utils.ts, /Users/abeer/dev/gig
...

---
id: ai-helper--ec6b735c-20260405T120638Z-pattern
type: pattern
project: ai-helper--ec6b735c
timestamp: 2026-04-05T12:06:38.851Z
branch: main
commit: 2d2d2235cd2df229cfa15a48565ec52743e2cf27
summary: Captured repeatable workflow patterns from the Codex thread.
tags: codex-sync, pattern
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper/AGENTS.md, /Users/abeer/dev/giga/ai-helper/.ai/prompts/preflight.md, /Users/abeer/dev/giga/ai-helper/.ai/prompts/summary.md
relatedCommit: 
---

# Codex session working patterns

- - Continue + Ollama are secondary helpers and must follow
...

## Decisions

---
id: ai-helper--ec6b735c-20260410T175804Z-decision
type: decision
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:58:04.711Z
branch: main
commit: 64e36bde4c58ffb94f220e4d6809088d6e5b1810
summary: Captured explicit working rules and approved defaults from the Codex thread.
tags: codex-sync, decision
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/file-utils.ts, /
...

---
id: ai-helper--ec6b735c-20260410T175351Z-decision
type: decision
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:53:51.532Z
branch: main
commit: 8614d1244781454e1f49f709f8073a3943619d3e
summary: Captured explicit working rules and approved defaults from the Codex thread.
tags: codex-sync, decision
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/file-utils.ts, /
...

---
id: ai-helper--ec6b735c-20260410T174326Z-decision
type: decision
project: ai-helper--ec6b735c
timestamp: 2026-04-10T17:43:26.171Z
branch: main
commit: 4dc253a480eeb4af8cc6f98d6e4ab9337642b4cf
summary: Captured explicit working rules and approved defaults from the Codex thread.
tags: codex-sync, decision
files: /Users/abeer/dev/giga/ai-helper/src, /Users/abeer/dev/giga/ai-helper/src/giga-auth/refresh-token.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/reset-password.ts, /Users/abeer/dev/giga/ai-helper/src/giga-auth/change-password.ts, /Users/abeer/dev/giga/ai-helper/src/file-utils.ts, /
...

---
id: ai-helper--ec6b735c-20260405T120638Z-decision
type: decision
project: ai-helper--ec6b735c
timestamp: 2026-04-05T12:06:38.825Z
branch: main
commit: 2d2d2235cd2df229cfa15a48565ec52743e2cf27
summary: Captured explicit working rules and approved defaults from the Codex thread.
tags: codex-sync, decision
files: /Users/abeer/dev/giga/ai-helper, /Users/abeer/dev/giga/ai-helper/AGENTS.md, /Users/abeer/dev/giga/ai-helper/.ai/prompts/preflight.md, /Users/abeer/dev/giga/ai-helper/.ai/prompts/summary.md
relatedCommit: 
---

# Codex session decisions

- - Codex Studio is the authoritative control s
...
