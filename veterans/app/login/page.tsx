'use client';
import React from 'react';
import { useMutation } from '@apollo/client';

import LoginForm from '@comComps/authForm/LoginForm';
import { LoginFormData } from 'types';
import { CURRENT_USER_QUERY, LOGIN_MUTATION } from 'constants/graphql';

export default function LoginPage() {
  const [login] = useMutation<{
    authenticateUserWithPassword:
      | { item: { id: string; email: string; role: string; name: string } }
      | { message: string };
  }>(LOGIN_MUTATION, {
    update(cache, { data }) {
      const authResult = data?.authenticateUserWithPassword;
      if (authResult && 'item' in authResult) {
        cache.writeQuery({
          query: CURRENT_USER_QUERY,
          data: { authenticatedItem: authResult.item },
        });
      } else {
        // eslint-disable-next-line no-console
        console.error('❌ Помилка входу');
      }
    },
  });

  const onSubmit = async (formData: LoginFormData): Promise<void> => {
    const { email, password } = formData;
    await login({ variables: { email, password } });
  };

  return <LoginForm onSubmit={onSubmit} />;
}
