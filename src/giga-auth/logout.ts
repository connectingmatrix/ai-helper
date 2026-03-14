import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { AuthResponseRecord, getErrorMessage } from './shared';

export async function logout(supabase: SupabaseClient): Promise<AuthResponseRecord> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      message: 'Logout successful',
      data: {
        profile: null,
        token: null,
      },
    };
  } catch (error: unknown) {
    throw new BadRequestError(getErrorMessage(error, 'Logout failed'));
  }
}
