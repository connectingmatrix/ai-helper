import { SupabaseClient } from '@supabase/supabase-js';
export declare function changePassword(supabase: SupabaseClient, data: {
    currentPassword: string;
    newPassword: string;
}): Promise<{
    message: string;
}>;
//# sourceMappingURL=change-password.d.ts.map