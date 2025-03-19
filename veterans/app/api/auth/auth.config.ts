import GoogleProvider from 'next-auth/providers/google';
import type { DefaultSession, NextAuthOptions } from 'next-auth';

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

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: getEnvVar('GOOGLE_CLIENT_ID'),
      clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
    }),
  ],
  pages: {
    signIn: '/login',
  },
  secret: getEnvVar('NEXTAUTH_SECRET', 'test-secret'),
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.sub;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};
