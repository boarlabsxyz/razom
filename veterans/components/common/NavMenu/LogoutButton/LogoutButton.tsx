'use client';

import { useApolloClient } from '@apollo/client';

import { LOGOUT_MUTATION } from 'constants/graphql';
import st from './LogoutButton.module.css';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  const client = useApolloClient();

  const handleLogout = async () => {
    try {
      await client.mutate({ mutation: LOGOUT_MUTATION });
      await client.clearStore();
      await signOut();
      window.location.reload();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Помилка при виході:', error);
    }
  };

  return (
    <button className={st.wrapper} onClick={handleLogout}>
      Вийти
    </button>
  );
}
