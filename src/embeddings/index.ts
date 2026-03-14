import OpenAI from 'openai';

import { toPgVector } from '../vector-utils';

export type EmbeddingVector = {
  vector: number[];
  pgVector: string;
};

export type EmbeddingClient = Pick<OpenAI, 'embeddings'>;

export type EmbeddingOptions = {
  model?: string;
  apiKey?: string;
  client?: EmbeddingClient;
};

export const DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';

let cachedClient: EmbeddingClient | null = null;

function resolveEmbeddingModel(model?: string): string {
  return model || process.env.OPENAI_EMBEDDING_MODEL || DEFAULT_EMBEDDING_MODEL;
}

function resolveDefaultClient(apiKey?: string): EmbeddingClient {
  if (apiKey) {
    return new OpenAI({ apiKey });
  }

  if (cachedClient) return cachedClient;

  const envApiKey = process.env.OPENAI_API_KEY;
  if (!envApiKey) {
    throw new Error(
      'OPENAI_API_KEY is not configured. Pass `apiKey` or `client` in options.',
    );
  }

  cachedClient = new OpenAI({ apiKey: envApiKey });
  return cachedClient;
}

function resolveClient(options?: EmbeddingOptions): EmbeddingClient {
  if (options?.client) return options.client;
  return resolveDefaultClient(options?.apiKey);
}

export async function createEmbedding(
  input: string,
  options?: EmbeddingOptions,
): Promise<EmbeddingVector> {
  const normalized = input.replace(/\s+/g, ' ').trim();
  if (!normalized) {
    throw new Error('Cannot create embedding for empty input.');
  }

  const client = resolveClient(options);
  const model = resolveEmbeddingModel(options?.model);
  const response = await client.embeddings.create({
    model,
    input: normalized,
  });

  const vector = response.data?.[0]?.embedding;
  if (!vector) {
    throw new Error('Embedding generation failed: no vector returned.');
  }

  return {
    vector,
    pgVector: toPgVector(vector),
  };
}

export async function createEmbeddings(
  inputs: string[],
  options?: EmbeddingOptions,
): Promise<EmbeddingVector[]> {
  const normalizedInputs = inputs.map((value) => value.replace(/\s+/g, ' ').trim());
  if (!normalizedInputs.length) return [];

  const client = resolveClient(options);
  const model = resolveEmbeddingModel(options?.model);
  const response = await client.embeddings.create({
    model,
    input: normalizedInputs,
  });

  if (!response.data || response.data.length !== normalizedInputs.length) {
    throw new Error('Embedding generation failed: mismatched embedding count.');
  }

  return response.data.map((item) => {
    if (!item.embedding) {
      throw new Error('Embedding generation failed: missing embedding vector.');
    }
    return {
      vector: item.embedding,
      pgVector: toPgVector(item.embedding),
    };
  });
}
