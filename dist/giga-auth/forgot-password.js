"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = forgotPassword;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function forgotPassword(supabase, data) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: data.redirectTo,
        });
        if (error) {
            throw new routing_controllers_1.BadRequestError(error.message);
        }
        return {
            message: 'Password reset email sent successfully',
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Password reset failed'));
    }
}
