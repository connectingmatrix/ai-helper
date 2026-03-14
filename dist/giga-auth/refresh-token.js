"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = refreshToken;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
async function refreshToken(supabase, accessToken) {
    try {
        const { error: userError } = await supabase.auth.getUser(accessToken);
        if (userError) {
            throw new routing_controllers_1.BadRequestError(userError.message);
        }
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData.session) {
            throw new routing_controllers_1.BadRequestError('No active session found');
        }
        return {
            message: 'Token refreshed successfully',
            data: {
                token: {
                    access_token: sessionData.session.access_token,
                    refresh_token: sessionData.session.refresh_token,
                    expires_at: sessionData.session.expires_at,
                },
            },
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Token refresh failed'));
    }
}
