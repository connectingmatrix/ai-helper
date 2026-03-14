"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = resetPassword;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function resetPassword(supabase, data) {
    try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            throw new routing_controllers_1.BadRequestError(sessionError.message);
        }
        const { error } = await supabase.auth.updateUser({
            password: data.password,
        });
        if (error) {
            throw new routing_controllers_1.BadRequestError(error.message);
        }
        const { data: profileData, error: profileError } = await supabase
            .from('User')
            .select('*, UserPreference(*), Subscription(*, Plans(*)), Role(*)')
            .eq('id', sessionData?.session?.user?.id)
            .single();
        if (profileError) {
            throw new routing_controllers_1.BadRequestError(profileError.message);
        }
        return {
            message: 'Password reset successfully',
            data: {
                profile: profileData,
                token: {
                    access_token: sessionData?.session?.access_token,
                    refresh_token: sessionData?.session?.refresh_token,
                    expires_at: sessionData?.session?.expires_at,
                },
            },
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Password reset failed'));
    }
}
