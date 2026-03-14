import { SupabaseClient } from '@supabase/supabase-js';
import { BadRequestError } from 'routing-controllers';
import { AuthResponseRecord, getErrorMessage } from './shared';

export async function verifyOtp(
  supabase: SupabaseClient,
  data: {
    token: string;
    email?: string;
    phone?: string;
    type?: 'email' | 'sms' | 'recovery';
  },
): Promise<AuthResponseRecord> {
  try {
    let verifyResult:
      | Awaited<ReturnType<SupabaseClient['auth']['verifyOtp']>>
      | undefined;

    if (data.email) {
      const emailType = data.type === 'recovery' ? 'recovery' : 'email';
      verifyResult = await supabase.auth.verifyOtp({
        email: data.email,
        token: data.token,
        type: emailType,
      });
    } else if (data.phone) {
      if (data.type && data.type !== 'sms') {
        throw new BadRequestError('Phone OTP verification only supports sms type');
      }

      verifyResult = await supabase.auth.verifyOtp({
        phone: data.phone,
        token: data.token,
        type: 'sms',
      });
    } else {
      throw new BadRequestError('Email or phone is required');
    }

    const { data: userData, error } = verifyResult;

    if (error) {
      throw new BadRequestError(error.message);
    }

    if (!userData?.user) {
      throw new BadRequestError('User not found');
    }

    const { data: profileData, error: profileError } = await supabase
      .from('User')
      .select('*, UserPreference(*), Subscription(*, Plans(*)), Role(*)')
      .eq('id', userData.user.id)
      .single();

    if (profileError) {
      throw new BadRequestError(profileError.message);
    }

    if (data.type === 'email' && profileData && !profileData.isVerified) {
      const { error: verifyError } = await supabase
        .from('User')
        .update({ isVerified: true, updatedAt: new Date().toISOString() })
        .eq('id', userData.user.id);

      if (verifyError) {
        throw new BadRequestError(verifyError.message);
      }

      profileData.isVerified = true;
    }

    return {
      message: 'OTP verified successfully',
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
    throw new BadRequestError(getErrorMessage(error, 'OTP verification failed'));
  }
}
