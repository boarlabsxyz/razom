import React from 'react';
import HomePage from '@comps/homePage/HomePage';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Page() {
  const headersList = headers();
  const host =
    headersList.get('host') || process.env.VERCEL_URL || 'localhost:8000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  if (typeof window === 'undefined') {
    process.env.NEXTAUTH_URL = `${protocol}://${host}`;
  }

  return <HomePage />;
}
