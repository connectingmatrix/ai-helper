"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSigninWithOtpEmail = sendSigninWithOtpEmail;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function sendSigninWithOtpEmail(supabase, email, redirectTo) {
    try {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectTo,
            },
        });
        if (error) {
            throw new routing_controllers_1.BadRequestError(error.message);
        }
        return {
            message: 'Sign-in OTP email sent successfully',
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Failed to send sign-in OTP email'));
    }
}
