import { SupabaseClient } from '@supabase/supabase-js';
import { AuthResponseRecord } from './shared';
export declare function verifyOtp(supabase: SupabaseClient, data: {
    token: string;
    email?: string;
    phone?: string;
    type?: 'email' | 'sms' | 'recovery';
}): Promise<AuthResponseRecord>;
//# sourceMappingURL=verify-otp.d.ts.map