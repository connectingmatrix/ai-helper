export type AuthTokenRecord = {
  access_token?: string | null;
  refresh_token?: string | null;
  expires_at?: number | null;
};

export type AuthResponseRecord = {
  message: string;
  data?: {
    profile?: Record<string, unknown> | null;
    token?: AuthTokenRecord | null;
    subscription?: Record<string, unknown> | null;
  };
};

export function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  return fallback;
}
