"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_EMBEDDING_MODEL = void 0;
exports.createEmbedding = createEmbedding;
exports.createEmbeddings = createEmbeddings;
exports.blendVectors = blendVectors;
const openai_1 = __importDefault(require("openai"));
const vector_utils_1 = require("../vector-utils");
exports.DEFAULT_EMBEDDING_MODEL = 'text-embedding-3-small';
let cachedClient = null;
function resolveEmbeddingModel(model) {
    return model || process.env.OPENAI_EMBEDDING_MODEL || exports.DEFAULT_EMBEDDING_MODEL;
}
function resolveDefaultClient(apiKey) {
    if (apiKey) {
        return new openai_1.default({ apiKey });
    }
    if (cachedClient)
        return cachedClient;
    const envApiKey = process.env.OPENAI_API_KEY;
    if (!envApiKey) {
        throw new Error('OPENAI_API_KEY is not configured. Pass `apiKey` or `client` in options.');
    }
    cachedClient = new openai_1.default({ apiKey: envApiKey });
    return cachedClient;
}
function resolveClient(options) {
    if (options?.client)
        return options.client;
    return resolveDefaultClient(options?.apiKey);
}
async function createEmbedding(input, options) {
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
        pgVector: (0, vector_utils_1.toPgVector)(vector),
    };
}
async function createEmbeddings(inputs, options) {
    const normalizedInputs = inputs.map((value) => value.replace(/\s+/g, ' ').trim());
    if (!normalizedInputs.length)
        return [];
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
            pgVector: (0, vector_utils_1.toPgVector)(item.embedding),
        };
    });
}
function blendVectors(existingVector, newVector, existingCount) {
    if (!existingVector || existingVector.length !== newVector.length) {
        return {
            vector: newVector,
            count: 1,
        };
    }
    const baseCount = existingCount > 0 ? existingCount : 1;
    const nextCount = baseCount + 1;
    const blended = newVector.map((value, index) => ((existingVector[index] * baseCount) + value) / nextCount);
    return {
        vector: blended,
        count: nextCount,
    };
}
