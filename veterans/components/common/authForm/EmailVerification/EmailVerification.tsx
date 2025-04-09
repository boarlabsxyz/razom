import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import st from '@comComps/authForm/AuthForm.module.css';
import { VERIFICATION_MUTATION, CHECK_USER_QUERY } from 'constants/graphql';

interface EmailVerificationProps {
  readonly verificationCode: string;
  readonly email: string;
}

export default function EmailVerification({
  verificationCode,
  email,
}: EmailVerificationProps) {
  const [confirmedCode, setConfirmedCode] = useState<string>('');
  const [updateUserVerification] = useMutation(VERIFICATION_MUTATION);
  const router = useRouter();
  const { data: userData } = useQuery(CHECK_USER_QUERY, {
    variables: { email },
  });

  const handleVerifyCode = async () => {
    if (confirmedCode !== verificationCode) {
      toast.error('Invalid verification code');
      return;
    }

    const userId = userData.user.id;

    try {
      const { data } = await updateUserVerification({
        variables: {
          id: userId,
          isVerified: true,
        },
      });

      if (data?.updateUser?.isVerified) {
        router.push('/');
      } else {
        toast.error('Verification failed');
      }
    } catch (error: unknown) {
      let message = 'Something went wrong during verification';

      if (error instanceof Error) {
        message = error.message;
      }
      toast.error(message);
    }
  };

  return (
    <div className={st['verify-container']}>
      <h3>Verify your email address</h3>

      <input
        type="text"
        id="confirmEmail"
        placeholder="Email verification"
        className={st.input}
        style={{ textAlign: 'center' }}
        value={confirmedCode}
        onChange={(e) => setConfirmedCode(e.target.value)}
      />

      <button type="button" className={st.button} onClick={handleVerifyCode}>
        Ok
      </button>
    </div>
  );
}
