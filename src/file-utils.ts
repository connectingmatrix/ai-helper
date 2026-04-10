import path from 'path';

import { trim } from 'lodash';
import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

import {
  DEFAULT_ALLOWED_EXTENSIONS,
  DEFAULT_ALLOWED_MIME_TYPES,
  DEFAULT_MIME_EXTENSION_MAP,
} from './constants/mime';
import { BinaryFileLike, MimeFileLike } from './types';

PDFParse.setWorker(require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs'));

export function getExtensionFromMimeType(
  file: MimeFileLike,
  mimeExtensionMap: Record<string, string> = DEFAULT_MIME_EXTENSION_MAP,
): string {
  const mimeType = String(file.mimetype || '')
    .split(';')[0]
    .trim()
    .toLowerCase();

  if (mimeType && mimeExtensionMap[mimeType]) {
    return mimeExtensionMap[mimeType];
  }

  const fallbackExt = path.extname(String(file.originalname || '')).toLowerCase().replace(/^\./, '');
  if (fallbackExt) return fallbackExt;

  if (mimeType.includes('/')) {
    const subtype = mimeType.split('/')[1]?.split('+')[0];
    const sanitizedSubtype = (subtype || '').replace(/[^a-z0-9]/g, '');
    if (sanitizedSubtype) return sanitizedSubtype;
  }

  return 'bin';
}

export async function extractTextFromFile(file: BinaryFileLike): Promise<string> {
  const extension = path.extname(String(file.originalname || '')).toLowerCase();

  if (file.mimetype === 'application/pdf' || extension === '.pdf') {
    const parser = new PDFParse({ data: file.buffer });

    try {
      const pdfData = await parser.getText();
      return trim(String(pdfData.text || ''));
    } finally {
      await parser.destroy();
    }
  }

  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === '.docx'
  ) {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return trim(String(result.value || ''));
  }

  if (
    file.mimetype === 'text/plain' ||
    file.mimetype === 'text/markdown' ||
    file.mimetype === 'text/csv' ||
    file.mimetype === 'application/json' ||
    extension === '.txt' ||
    extension === '.md' ||
    extension === '.csv' ||
    extension === '.json'
  ) {
    return trim(file.buffer.toString('utf8'));
  }

  return '';
}

export function validateFiles<T extends MimeFileLike>(
  files: T[],
  allowedMimeTypes: string[] = DEFAULT_ALLOWED_MIME_TYPES,
  allowedExtensions: string[] = DEFAULT_ALLOWED_EXTENSIONS,
): void {
  for (const file of files) {
    const extension = path.extname(String(file.originalname || '')).toLowerCase();

    if (
      !allowedMimeTypes.includes(String(file.mimetype || '')) &&
      !allowedExtensions.includes(extension)
    ) {
      throw new Error(
        `Unsupported file type: ${String(file.originalname || 'unknown')} (${String(file.mimetype || 'unknown')})`,
      );
    }
  }
}
