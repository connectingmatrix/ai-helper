"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerification = resendVerification;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function resendVerification(supabase, email) {
    try {
        const { data: userData, error: userError } = await supabase
            .from('User')
            .select('email, isVerified')
            .eq('email', email)
            .single();
        if (userError && userError.code !== 'PGRST116') {
            throw new routing_controllers_1.BadRequestError('User not found');
        }
        if (userData?.isVerified) {
            throw new routing_controllers_1.BadRequestError('User is already verified');
        }
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });
        if (error) {
            if (error.message?.includes('rate limit')) {
                throw new routing_controllers_1.BadRequestError('Too many requests. Please wait a few minutes before trying again.');
            }
            if (error.message?.includes('not found')) {
                throw new routing_controllers_1.BadRequestError('User not found or email not registered.');
            }
            if (error.message?.includes('already confirmed')) {
                throw new routing_controllers_1.BadRequestError('Email is already verified.');
            }
            throw new routing_controllers_1.BadRequestError(`Failed to resend verification email: ${error.message}`);
        }
        return {
            message: 'Verification email sent successfully',
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Failed to resend verification email'));
    }
}
