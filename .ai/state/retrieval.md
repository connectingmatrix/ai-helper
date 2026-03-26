# Retrieval Index: ai-helper

- Generated: 2026-03-25T10:01:13.359Z
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
- Local prompts and generated context under `.ai/` should stay aligned with shared brain memory.

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
- string fields are trimmed and become `null` when empty/invalid (`toOptionalString`)
- boolean fields are normalized via `toSafeBoolean`
- unknown keys are camel-cased (`created_at` → `createdAt`) unless mapped with `@NormalizeField`

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
- `.gitignore`
- `AGENTS.md`
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

### Item 2

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

### Item 3

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

### Item 4

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


## Recent Transcripts

### Item 1

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

### Item 2

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

### Item 1

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

### Item 2

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

### Item 3

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

### Item 4

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

### Item 1

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

### Item 2

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

### Item 3

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

### Item 4

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

