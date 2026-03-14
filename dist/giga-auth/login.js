"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function login(supabase, credentials) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
        });
        if (error) {
            throw new routing_controllers_1.BadRequestError(error.message);
        }
        if (!data.user) {
            throw new routing_controllers_1.BadRequestError('Login failed');
        }
        const { data: profile, error: profileError } = await supabase
            .from('User')
            .select('*, UserPreference(*), Subscription(*, Plans(*)), Role(*)')
            .eq('id', data.user.id)
            .single();
        if (profileError) {
            throw new routing_controllers_1.BadRequestError('Failed to fetch user profile');
        }
        return {
            message: 'Login successful',
            data: {
                profile,
                token: {
                    access_token: data.session?.access_token,
                    refresh_token: data.session?.refresh_token,
                    expires_at: data.session?.expires_at,
                },
            },
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Login failed'));
    }
}
