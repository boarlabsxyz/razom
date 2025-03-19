import { headers } from 'next/headers';

export function setupNextAuthUrl() {
  if (typeof window === 'undefined' && !process.env.NEXTAUTH_URL) {
    try {
      const headersList = headers();
      const host = headersList.get('host');

      if (host && host.trim() !== '') {
        const protocol =
          process.env.NODE_ENV === 'production' ? 'https' : 'http';
        process.env.NEXTAUTH_URL = `${protocol}://${host}`;
      } else if (
        process.env.VERCEL_URL &&
        process.env.VERCEL_URL.trim() !== ''
      ) {
        process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
      } else {
        process.env.NEXTAUTH_URL = 'http://localhost:8000';
      }
    } catch {
      // During build time or when headers() is not available
      if (process.env.VERCEL_URL && process.env.VERCEL_URL.trim() !== '') {
        process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
      } else {
        process.env.NEXTAUTH_URL = 'http://localhost:8000';
      }
    }
  }
}
