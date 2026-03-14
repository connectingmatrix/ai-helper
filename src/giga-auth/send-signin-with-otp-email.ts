import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { getErrorMessage } from './shared';

export async function sendSigninWithOtpEmail(
  supabase: SupabaseClient,
  email: string,
  redirectTo?: string,
): Promise<{ message: string }> {
  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      message: 'Sign-in OTP email sent successfully',
    };
  } catch (error: unknown) {
    throw new BadRequestError(
      getErrorMessage(error, 'Failed to send sign-in OTP email'),
    );
  }
}
