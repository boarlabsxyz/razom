import { signIn, signOut, useSession } from 'next-auth/react';
import styles from './AuthForm.module.css';

export default function LoginAuthButton() {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Привіт, {session.user?.name}</p>
      <button className={styles.button} onClick={() => signOut()}>
        Вийти
      </button>
    </div>
  ) : (
    <button className={styles.button} onClick={() => signIn('google')}>
      Увійти через Google
    </button>
  );
}
