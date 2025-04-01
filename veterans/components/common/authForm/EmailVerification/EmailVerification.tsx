import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import st from '@comComps/authForm/AuthForm.module.css';

interface EmailVerificationProps {
  verificationCode: string;
}

export default function EmailVerification({
  verificationCode,
}: EmailVerificationProps) {
  const [confirmedCode, setConfirmedCode] = useState<string>('');
  const router = useRouter();

  const handleVerifyCode = () => {
    if (confirmedCode === verificationCode) {
      router.push('/login');
    } else {
      // eslint-disable-next-line no-alert
      alert('Invalid verification code');
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
