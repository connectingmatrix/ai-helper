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
