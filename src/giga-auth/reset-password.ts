import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { AuthResponseRecord, getErrorMessage } from './shared';

export async function resetPassword(
  supabase: SupabaseClient,
  data: {
    password: string;
  },
): Promise<AuthResponseRecord> {
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new BadRequestError(sessionError.message);
    }

    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    const { data: profileData, error: profileError } = await supabase
      .from('User')
      .select('*, UserPreference(*), Subscription(*, Plans(*)), Role(*)')
      .eq('id', sessionData?.session?.user?.id)
      .single();

    if (profileError) {
      throw new BadRequestError(profileError.message);
    }

    return {
      message: 'Password reset successfully',
      data: {
        profile: profileData,
        token: {
          access_token: sessionData?.session?.access_token,
          refresh_token: sessionData?.session?.refresh_token,
          expires_at: sessionData?.session?.expires_at,
        },
      },
    };
  } catch (error: unknown) {
    throw new BadRequestError(getErrorMessage(error, 'Password reset failed'));
  }
}
