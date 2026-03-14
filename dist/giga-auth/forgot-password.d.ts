import { SupabaseClient } from '@supabase/supabase-js';
export declare function forgotPassword(supabase: SupabaseClient, data: {
    email: string;
    redirectTo?: string;
}): Promise<{
    message: string;
}>;
//# sourceMappingURL=forgot-password.d.ts.map