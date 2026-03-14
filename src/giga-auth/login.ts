import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { AuthResponseRecord, getErrorMessage } from './shared';

export async function login(
  supabase: SupabaseClient,
  credentials: {
    email: string;
    password: string;
  },
): Promise<AuthResponseRecord> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      throw new BadRequestError(error.message);
    }

    if (!data.user) {
      throw new BadRequestError('Login failed');
    }

    const { data: profile, error: profileError } = await supabase
      .from('User')
      .select('*, UserPreference(*), Subscription(*, Plans(*)), Role(*)')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      throw new BadRequestError('Failed to fetch user profile');
    }

    return {
      message: 'Login successful',
      data: {
        profile,
        token: {
          access_token: data.session?.access_token,
          refresh_token: data.session?.refresh_token,
          expires_at: data.session?.expires_at,
        },
      },
    };
  } catch (error: unknown) {
    throw new BadRequestError(getErrorMessage(error, 'Login failed'));
  }
}
