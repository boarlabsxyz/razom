import { headers } from 'next/headers';

export function setupNextAuthUrl() {
  if (typeof window === 'undefined' && !process.env.NEXTAUTH_URL) {
    const headersList = headers();
    const host = headersList.get('host');

    if (host) {
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      process.env.NEXTAUTH_URL = `${protocol}://${host}`;
    } else if (process.env.VERCEL_URL) {
      process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
    } else {
      process.env.NEXTAUTH_URL = 'http://localhost:8000';
    }
  }
}
