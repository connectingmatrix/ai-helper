import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { getErrorMessage } from './shared';

export async function changePassword(
  supabase: SupabaseClient,
  data: {
    currentPassword: string;
    newPassword: string;
  },
): Promise<{ message: string }> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      throw new BadRequestError('User not authenticated');
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: userData.user.email || '',
      password: data.currentPassword,
    });

    if (verifyError) {
      throw new BadRequestError('Current password is incorrect');
    }

    const { error } = await supabase.auth.updateUser({
      password: data.newPassword,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    return {
      message: 'Password changed successfully',
    };
  } catch (error: unknown) {
    throw new BadRequestError(getErrorMessage(error, 'Password change failed'));
  }
}
