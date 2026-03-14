import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { AuthResponseRecord, getErrorMessage } from './shared';

const DEVELOPMENT_ROLE_ID = 'dd3d4349-1cba-40f8-bc37-4a2209359376';

export type SignupPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
};

export type SignupOptions = {
  roleId?: string;
  forceDevelopmentRole?: boolean;
};

type UserRecord = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  username: string;
  roleId: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  isVerified: boolean;
};

function resolveRoleId(options?: SignupOptions): string {
  if (options?.roleId) return options.roleId;
  if (options?.forceDevelopmentRole) return DEVELOPMENT_ROLE_ID;
  if (process.env.NODE_ENV === 'production') {
    return process.env.ROLE_ID || DEVELOPMENT_ROLE_ID;
  }
  return DEVELOPMENT_ROLE_ID;
}

export async function signup(
  supabase: SupabaseClient,
  userData: SignupPayload,
  options?: SignupOptions,
): Promise<AuthResponseRecord> {
  try {
    const roleId = resolveRoleId(options);

    const { data: existingUser, error: existingUserError } = await supabase
      .from('User')
      .select('username')
      .or(`username.eq.${userData.username},email.eq.${userData.email}`)
      .single();

    if (existingUser) {
      throw new BadRequestError('User already exists');
    }

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      throw new BadRequestError(existingUserError.message);
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
      throw new BadRequestError(authError.message);
    }

    if (!authData.user) {
      throw new BadRequestError('Failed to create user');
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: userData.email,
    });

    if (otpError) {
      throw new BadRequestError(otpError.message);
    }

    const userProfile: Partial<UserRecord> = {
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
      throw new BadRequestError(`Failed to create user profile: ${profileError.message}`);
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
  } catch (error: unknown) {
    throw new BadRequestError(getErrorMessage(error, 'Signup failed'));
  }
}
