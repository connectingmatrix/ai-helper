import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { AuthResponseRecord, getErrorMessage } from './shared';

export async function refreshToken(
  supabase: SupabaseClient,
  accessToken: string,
): Promise<AuthResponseRecord> {
  try {
    const { error: userError } = await supabase.auth.getUser(accessToken);

    if (userError) {
      throw new BadRequestError(userError.message);
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      throw new BadRequestError('No active session found');
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
  } catch (error: unknown) {
    throw new BadRequestError(getErrorMessage(error, 'Token refresh failed'));
  }
}
