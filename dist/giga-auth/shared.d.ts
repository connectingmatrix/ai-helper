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
export declare function getErrorMessage(error: unknown, fallback: string): string;
//# sourceMappingURL=shared.d.ts.map