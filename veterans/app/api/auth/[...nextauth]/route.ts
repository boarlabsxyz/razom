import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const dynamic = 'force-dynamic';

// Helper function to validate and construct URLs
const getValidUrl = (url: string, baseUrl: string): string => {
  // If it's a relative URL, join it with the base URL
  if (url.startsWith('/')) {
    return baseUrl + url;
  }

  try {
    const urlObj = new URL(url);
    const baseUrlObj = new URL(baseUrl);

    // Check if the URL is for our domain
    if (urlObj.origin === baseUrlObj.origin) {
      return url;
    }
  } catch {
    // If URL parsing fails, ignore and return base URL
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
      const baseUrl =
        process.env.NEXTAUTH_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:8000');

      return getValidUrl(url, baseUrl);
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
});

export { handler as GET, handler as POST };
