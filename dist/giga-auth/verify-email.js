"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = verifyEmail;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function verifyEmail(supabase, data) {
    try {
        const { data: userData, error } = await supabase.auth.verifyOtp({
            email: data.email,
            token: data.token,
            type: data.type,
        });
        if (error) {
            throw new routing_controllers_1.BadRequestError(error.message);
        }
        if (!userData?.user) {
            throw new routing_controllers_1.BadRequestError('User not found');
        }
        const { data: profileData, error: profileError } = await supabase
            .from('User')
            .update({ isVerified: true, updatedAt: new Date().toISOString() })
            .eq('id', userData.user.id)
            .select('*, UserPreference(*), Subscription(*, Plans(*)), Role(*)')
            .single();
        if (profileError) {
            throw new routing_controllers_1.BadRequestError(profileError.message);
        }
        return {
            message: 'Email verified successfully',
            data: {
                profile: profileData,
                token: {
                    access_token: userData.session?.access_token,
                    refresh_token: userData.session?.refresh_token,
                    expires_at: userData.session?.expires_at,
                },
            },
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Email verification failed'));
    }
}
