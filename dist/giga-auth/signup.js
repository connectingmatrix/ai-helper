"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = signup;
const routing_controllers_1 = require("routing-controllers");
const shared_1 = require("./shared");
const DEVELOPMENT_ROLE_ID = 'dd3d4349-1cba-40f8-bc37-4a2209359376';
function resolveRoleId(options) {
    if (options?.roleId)
        return options.roleId;
    if (options?.forceDevelopmentRole)
        return DEVELOPMENT_ROLE_ID;
    if (process.env.NODE_ENV === 'production') {
        return process.env.ROLE_ID || DEVELOPMENT_ROLE_ID;
    }
    return DEVELOPMENT_ROLE_ID;
}
async function signup(supabase, userData, options) {
    try {
        const roleId = resolveRoleId(options);
        const { data: existingUser, error: existingUserError } = await supabase
            .from('User')
            .select('username')
            .or(`username.eq.${userData.username},email.eq.${userData.email}`)
            .single();
        if (existingUser) {
            throw new routing_controllers_1.BadRequestError('User already exists');
        }
        if (existingUserError && existingUserError.code !== 'PGRST116') {
            throw new routing_controllers_1.BadRequestError(existingUserError.message);
        }
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    username: userData.username,
                    roleId,
                },
            },
        });
        if (authError) {
            throw new routing_controllers_1.BadRequestError(authError.message);
        }
        if (!authData.user) {
            throw new routing_controllers_1.BadRequestError('Failed to create user');
        }
        const { error: otpError } = await supabase.auth.signInWithOtp({
            email: userData.email,
        });
        if (otpError) {
            throw new routing_controllers_1.BadRequestError(otpError.message);
        }
        const userProfile = {
            id: authData.user.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: `${userData.firstName} ${userData.lastName}`,
            username: userData.username,
            roleId,
            phone: userData.phone || null,
            address: userData.address || null,
            city: userData.city || null,
            state: userData.state || null,
            country: userData.country || null,
            postalCode: userData.postalCode || null,
            isVerified: false,
        };
        const { data: profileData, error: profileError } = await supabase
            .from('User')
            .insert(userProfile)
            .select('*')
            .single();
        if (profileError) {
            throw new routing_controllers_1.BadRequestError(`Failed to create user profile: ${profileError.message}`);
        }
        return {
            message: 'User created successfully. Please check your email for verification.',
            data: {
                profile: profileData,
                subscription: {},
                token: {
                    access_token: authData.session?.access_token,
                    refresh_token: authData.session?.refresh_token,
                    expires_at: authData.session?.expires_at,
                },
            },
        };
    }
    catch (error) {
        throw new routing_controllers_1.BadRequestError((0, shared_1.getErrorMessage)(error, 'Signup failed'));
    }
}
