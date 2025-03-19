import GoogleProvider from 'next-auth/providers/google';
import type { DefaultSession, NextAuthOptions } from 'next-auth';
import { setupNextAuthUrl } from '../../../utils/auth';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

const getEnvVar = (key: string, testValue = 'test-value') => {
  const isTest = typeof jest !== 'undefined';
  if (isTest) {
    return testValue;
  }
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: getEnvVar('NEXTAUTH_SECRET', 'test-secret'),
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token }) {
      setupNextAuthUrl();
      return token;
    },
  },
  pages: {
    signIn: '/login',
  },
};
