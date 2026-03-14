import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { getErrorMessage } from './shared';

export async function resendVerification(
  supabase: SupabaseClient,
  email: string,
): Promise<{ message: string }> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('email, isVerified')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      throw new BadRequestError('User not found');
    }

    if (userData?.isVerified) {
      throw new BadRequestError('User is already verified');
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      if (error.message?.includes('rate limit')) {
        throw new BadRequestError(
          'Too many requests. Please wait a few minutes before trying again.',
        );
      }

      if (error.message?.includes('not found')) {
        throw new BadRequestError('User not found or email not registered.');
      }

      if (error.message?.includes('already confirmed')) {
        throw new BadRequestError('Email is already verified.');
      }

      throw new BadRequestError(`Failed to resend verification email: ${error.message}`);
    }

    return {
      message: 'Verification email sent successfully',
    };
  } catch (error: unknown) {
    throw new BadRequestError(
      getErrorMessage(error, 'Failed to resend verification email'),
    );
  }
}
