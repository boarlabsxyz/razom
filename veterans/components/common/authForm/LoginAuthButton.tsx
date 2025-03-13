import { signIn, signOut, useSession } from 'next-auth/react';

export default function LoginAuthButton() {
  const { data: session } = useSession();

  return session ? (
    <div>
      <p>Привіт, {session.user?.name}</p>
      <button onClick={() => signOut()}>Вийти</button>
    </div>
  ) : (
    <button onClick={() => signIn('google')}>Увійти через Google</button>
  );
}
