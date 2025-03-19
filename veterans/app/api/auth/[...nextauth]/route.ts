import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';

export const dynamic = 'force-dynamic';

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
