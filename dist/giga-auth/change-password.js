"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = changePassword;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function changePassword(supabase, data) {
    try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
            throw new routing_controllers_1.BadRequestError('User not authenticated');
        }
        const { error: verifyError } = await supabase.auth.signInWithPassword({
            email: userData.user.email || '',
            password: data.currentPassword,
        });
        if (verifyError) {
            throw new routing_controllers_1.BadRequestError('Current password is incorrect');
        }
        const { error } = await supabase.auth.updateUser({
            password: data.newPassword,
        });
        if (error) {
            throw new routing_controllers_1.BadRequestError(error.message);
        }
        return {
            message: 'Password changed successfully',
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Password change failed'));
    }
}
