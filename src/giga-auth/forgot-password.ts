import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { getErrorMessage } from './shared';

export async function forgotPassword(
  supabase: SupabaseClient,
  data: {
    email: string;
    redirectTo?: string;
  },
): Promise<{ message: string }> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: data.redirectTo,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      message: 'Password reset email sent successfully',
    };
  } catch (error: unknown) {
    throw new BadRequestError(getErrorMessage(error, 'Password reset failed'));
  }
}
