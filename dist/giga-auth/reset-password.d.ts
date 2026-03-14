import { SupabaseClient } from '@supabase/supabase-js';
import { AuthResponseRecord } from './shared';
export declare function resetPassword(supabase: SupabaseClient, data: {
    password: string;
}): Promise<AuthResponseRecord>;
//# sourceMappingURL=reset-password.d.ts.map