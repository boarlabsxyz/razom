import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const dynamic = 'force-dynamic';

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
      const nextAuthUrl =
        process.env.NEXTAUTH_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:8000');

      try {
        if (url.startsWith('/')) {
          return `${nextAuthUrl}${url}`;
        }
        const urlObj = new URL(url);
        const baseUrlObj = new URL(nextAuthUrl);

        if (urlObj.origin === baseUrlObj.origin) {
          return url;
        }
        return nextAuthUrl;
      } catch {
        return nextAuthUrl;
      }
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };
