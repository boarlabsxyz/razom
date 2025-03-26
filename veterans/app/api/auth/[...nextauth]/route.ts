import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  if (typeof window === 'undefined') {
    const headersList = headers();
    const host =
      headersList.get('host') || process.env.VERCEL_URL || 'localhost:8000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    return `${protocol}://${host}`;
  }

  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:8000';
};

const getValidUrl = (url: string): string => {
  const baseUrl = getBaseUrl();

  if (url.startsWith('/')) {
    return baseUrl + url;
  }

  try {
    const urlObj = new URL(url);
    const baseUrlObj = new URL(baseUrl);

    if (urlObj.origin === baseUrlObj.origin) {
      return url;
    }
  } catch {
    void 0;
  }

  return baseUrl;
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async signIn() {
      return true;
    },
    async redirect({ url }) {
      return getValidUrl(url);
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };
