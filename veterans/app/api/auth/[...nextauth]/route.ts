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
        process.env.NEXTAUTH_URL || `https://${process.env.VERCEL_URL}`;
      if (url.startsWith('/')) {
        return `${nextAuthUrl}${url}`;
      } else if (new URL(url).origin === nextAuthUrl) {
        return url;
      }
      return nextAuthUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };
