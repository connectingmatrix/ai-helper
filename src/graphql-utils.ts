export type GraphqlFileInput = {
  content_base64?: string | null;
  file_name?: string | null;
  mime_type?: string | null;
};

export type ParsedGraphqlFile = {
  fieldname: string;
  originalname: string;
  encoding: '7bit';
  mimetype: string;
  size: number;
  buffer: Buffer;
};

export function parseFileInputs(
  fileInputs?: Array<GraphqlFileInput | null | undefined> | null,
): ParsedGraphqlFile[] {
  if (!Array.isArray(fileInputs)) return [];

  return fileInputs
    .map((item, index) => {
      const base64 = item?.content_base64?.trim();
      if (!base64) return null;

      const encoded = base64.includes(',')
        ? base64.split(',').pop() || ''
        : base64;
      const buffer = Buffer.from(encoded, 'base64');

      return {
        fieldname: 'files',
        originalname: item?.file_name || `upload-${index + 1}.bin`,
        encoding: '7bit' as const,
        mimetype: item?.mime_type || 'application/octet-stream',
        size: buffer.byteLength,
        buffer,
      };
    })
    .filter(Boolean) as ParsedGraphqlFile[];
}
