import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { AuthResponseRecord, getErrorMessage } from './shared';

export async function verifyEmail(
  supabase: SupabaseClient,
  data: {
    token: string;
    email: string;
    type: string;
  },
): Promise<AuthResponseRecord> {
  try {
    const { data: userData, error } = await supabase.auth.verifyOtp({
      email: data.email,
      token: data.token,
      type: data.type as 'signup' | 'email' | 'recovery',
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    if (!userData?.user) {
      throw new BadRequestError('User not found');
    }

    const { data: profileData, error: profileError } = await supabase
      .from('User')
      .update({ isVerified: true, updatedAt: new Date().toISOString() })
      .eq('id', userData.user.id)
      .select('*, UserPreference(*), Subscription(*, Plans(*)), Role(*)')
      .single();

    if (profileError) {
      throw new BadRequestError(profileError.message);
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
  } catch (error: unknown) {
    throw new BadRequestError(getErrorMessage(error, 'Email verification failed'));
  }
}
