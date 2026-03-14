import { SupabaseClient } from '@supabase/supabase-js';
import { AuthResponseRecord } from './shared';
export type SignupPayload = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
};
export type SignupOptions = {
    roleId?: string;
    forceDevelopmentRole?: boolean;
};
export declare function signup(supabase: SupabaseClient, userData: SignupPayload, options?: SignupOptions): Promise<AuthResponseRecord>;
//# sourceMappingURL=signup.d.ts.map