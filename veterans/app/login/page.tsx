'use client';

import React, { useState } from 'react';
import { useApolloClient, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';

import LoginForm from '@comComps/authForm/LoginForm';
import { LoginFormData } from 'types';
import { CURRENT_USER_QUERY, LOGIN_MUTATION } from 'constants/graphql';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient();
  const router = useRouter();

  const [login] = useMutation(LOGIN_MUTATION, {
    onCompleted(data) {
      const authResult = data?.authenticateUserWithPassword;

      if (authResult && 'item' in authResult) {
        client.writeQuery({
          query: CURRENT_USER_QUERY,
          data: { authenticatedItem: authResult.item },
        });

        if (window.history.length > 1) {
          router.back();
        } else {
          router.push('/');
        }
      } else {
        setError(authResult?.message || 'Невідома помилка входу');
      }
    },
    onError(err) {
      setError(err.message);
    },
  });

  const onSubmit = async (formData: LoginFormData) => {
    setError(null);
    await login({ variables: formData });
  };

  return <LoginForm onSubmit={onSubmit} error={error ?? undefined} />;
}
