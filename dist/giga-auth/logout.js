"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = logout;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function logout(supabase) {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new routing_controllers_1.BadRequestError(error.message);
        }
        return {
            message: 'Logout successful',
            data: {
                profile: null,
                token: null,
            },
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Logout failed'));
    }
}
