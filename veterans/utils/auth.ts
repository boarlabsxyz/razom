import { headers } from 'next/headers';

export function setupNextAuthUrl() {
  if (typeof window === 'undefined') {
    const headersList = headers();
    const host =
      headersList.get('host') || process.env.VERCEL_URL || 'localhost:8000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    process.env.NEXTAUTH_URL = `${protocol}://${host}`;
  }
}
