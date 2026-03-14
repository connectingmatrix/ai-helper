"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = verifyOtp;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function verifyOtp(supabase, data) {
    try {
        let verifyResult;
        if (data.email) {
            const emailType = data.type === 'recovery' ? 'recovery' : 'email';
            verifyResult = await supabase.auth.verifyOtp({
                email: data.email,
                token: data.token,
                type: emailType,
            });
        }
        else if (data.phone) {
            if (data.type && data.type !== 'sms') {
                throw new routing_controllers_1.BadRequestError('Phone OTP verification only supports sms type');
            }
            verifyResult = await supabase.auth.verifyOtp({
                phone: data.phone,
                token: data.token,
                type: 'sms',
            });
        }
        else {
            throw new routing_controllers_1.BadRequestError('Email or phone is required');
        }
        const { data: userData, error } = verifyResult;
        if (error) {
            throw new routing_controllers_1.BadRequestError(error.message);
        }
        if (!userData?.user) {
            throw new routing_controllers_1.BadRequestError('User not found');
        }
        const { data: profileData, error: profileError } = await supabase
            .from('User')
            .select('*, UserPreference(*), Subscription(*, Plans(*)), Role(*)')
            .eq('id', userData.user.id)
            .single();
        if (profileError) {
            throw new routing_controllers_1.BadRequestError(profileError.message);
        }
        if (data.type === 'email' && profileData && !profileData.isVerified) {
            const { error: verifyError } = await supabase
                .from('User')
                .update({ isVerified: true, updatedAt: new Date().toISOString() })
                .eq('id', userData.user.id);
            if (verifyError) {
                throw new routing_controllers_1.BadRequestError(verifyError.message);
            }
            profileData.isVerified = true;
        }
        return {
            message: 'OTP verified successfully',
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
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'OTP verification failed'));
    }
}
