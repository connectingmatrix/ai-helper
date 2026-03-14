import { SupabaseClient } from '@supabase/supabase-js';
import { AuthResponseRecord } from './shared';
export declare function verifyEmail(supabase: SupabaseClient, data: {
    token: string;
    email: string;
    type: string;
}): Promise<AuthResponseRecord>;
//# sourceMappingURL=verify-email.d.ts.map