import { SupabaseClient } from '@supabase/supabase-js';
import { AuthResponseRecord } from './shared';
export declare function login(supabase: SupabaseClient, credentials: {
    email: string;
    password: string;
}): Promise<AuthResponseRecord>;
//# sourceMappingURL=login.d.ts.map