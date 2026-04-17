# Retrieval Index: ai-helper

- Generated: 2026-04-17T07:44:59.979Z
- Repo path: `giga/ai-helper`
- Package manager: `yarn`
- Validations:
- `yarn build`

## AGENTS

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

## Validation Expectations

- `yarn build`

## Memory Usage Rules

- Summaries belong in shared project memory after meaningful work.
- Failures must capture symptom, root cause, attempted fix, and validation result.
- Repeated successful solutions should be promoted into pattern memory.
- Major architecture or workflow choices should be recorded in decision memory.
- Local prompts and generated context under `.ai/` 
...

## README

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
- boolean fields are normalized via `toSafeBoolean`
- unknown keys are camel-cased (`created_at` → `createdAt`)

## package.json

{
  "name": "giga-ai-helper",
  "version": "1.0.0",
  "description": "Shared helper utilities for Giga AI services.",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "typesVersions": {
    "*": {
      "giga-auth": [
        "dist/giga-auth/index.d.ts"
      ],
      "chunking": [
        "dist/chunking/index.d.ts"
      ],
      "embeddings": [
        "dist/embeddings/index.d.ts"
      ],
      "embedding": [
        "dist/embeddings/index.d.ts"
      ],
      "serp-search": [
        "dist/serp-search/index.d.ts"
      ],
      "workflow": [
        "dist/workflow/index.d.ts"
      ]
    }
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "require": "./dist/index.js",
      "default": "./dist/index.js"
    },
    "./giga-auth": {
      "types": "./dist/giga-auth/index.d.ts",
      "require": "./dist/giga-auth/index.js",
      "default": "./dist/giga-auth/index.js"
    },
    "./chunking": {
      "types": "./dist/chunking/index.d.ts",
      "require": "./dist/chunking/index.js",
      "default": "./dist/chunking/index.js"
    },
    "./embeddings": {
      "types": "./dist/embeddings/index.d.ts",
      "require": "./dist/embeddings/index.js",
      "default": "./dist/embeddings/index.js"
    },
    "./embedding": {
      "types": "./dist/embeddings/index.d.ts",
      "require": "./dist/embeddings/index.js",
      "default": "./dist/embeddings/index.js"
    },
    "./serp-search": {
      "types": "./dist/serp-search/index.d.ts",
      "require": "./dist/serp-search/index.js",
      "default": "./dist/serp-search/index.js"
    },
    "./workflow": {
      "types": "./dist/workflow/index.d.ts",
      "require": "./dist/workflow/index.js",
      "default": "./dist/workflow/index.js"
    }
  },
  "files": [
    "dist"
  ],
  "scripts": {
...

## tsconfig

{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "outDir": "dist",
    "rootDir": "src",
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "types": [
      "node"
    ]
  },
  "include": [
    "src/**/*.ts"
  ]
}

## Architecture Files

- `AGENTS.md`
- `README.md`

## Architecture Context

### Item 1

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

### Item 2

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


## Repo Tree

- `.ai/`
- `.ai/bin/`
- `.ai/bin/ai-context`
- `.ai/bin/ai-context-build`
- `.ai/bin/ai-init`
- `.ai/bin/ai-memory-build`
- `.ai/bin/ai-memory-latest`
- `.ai/bin/ai-repair`
- `.ai/bin/ai-sync`
- `.ai/prompts/`
- `.ai/prompts/preflight.md`
- `.ai/prompts/repair.md`
- `.ai/prompts/summary.md`
- `.ai/state/`
- `.ai/state/architecture-context.md`
- `.ai/state/codex-context.md`
- `.ai/state/portable-root.json`
- `.ai/state/retrieval.md`
- `.continue/`
- `.continue/config.yaml`
- `.continue/rules/`
- `.continue/rules/portable-brain.md`
- `.DS_Store`
- `.gitignore`
- `AGENTS.md`
- `ai-helper.zip`
- `package.json`
- `README.md`
- `src/`
- `src/action-utils.ts`
- `src/chunking/`
- `src/chunking/index.ts`
- `src/collection-utils.ts`
- `src/constants/`
- `src/constants/mime.ts`
- `src/embeddings/`
- `src/embeddings/index.ts`
- `src/file-utils.ts`
- `src/giga-auth/`
- `src/giga-auth/change-password.ts`
- `src/giga-auth/forgot-password.ts`
- `src/giga-auth/index.ts`
- `src/giga-auth/login.ts`
- `src/giga-auth/logout.ts`
- `src/giga-auth/refresh-token.ts`
- `src/giga-auth/resend-verification.ts`
- `src/giga-auth/reset-password.ts`
- `src/giga-auth/send-signin-with-otp-email.ts`
- `src/giga-auth/shared.ts`
- `src/giga-auth/signup.ts`
- `src/giga-auth/verify-email.ts`
- `src/giga-auth/verify-otp.ts`
- `src/graphql-utils.ts`
- `src/index.ts`
- `src/json-utils.ts`
- `src/normalize-utils.ts`
- `src/number-utils.ts`
- `src/path-utils.ts`
- `src/pdf-worker.d.ts`
- `src/safe-utils.ts`
- `src/scoring-utils.ts`
- `src/serp-search/`
- `src/serp-search/index.ts`
- `src/string-utils.ts`
- `src/tag-utils.ts`
- `src/types.ts`
- `src/vector-utils.ts`
- `src/workflow/`
- `src/workflow/index.ts`
- `src/workflow/logger.ts`
- `src/workflow/runtime-utils.ts`
- `src/workflow/types.ts`
- `src/workflow/value-utils.ts`
- `tsconfig.json`
- `yarn.lock`

## Recent Summaries

### Item 1

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

### Item 2

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

### Item 3

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

### Item 4

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


## Recent Transcripts

### Item 1

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

### Item 2

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

### Item 1

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

### Item 2

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

### Item 3

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

### Item 4

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

### Item 1

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

### Item 2

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

### Item 3

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

### Item 4

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

