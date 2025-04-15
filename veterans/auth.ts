import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  sessionData: 'name role createdAt',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      role: 'Administrator',
    },
    skipKeystoneWelcome: true,
  },
});

const sessionMaxAge = 60 * 60 * 24 * 30;
const isProd = process.env.NODE_ENV === 'production';

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: process.env.SESSION_SECRET,
  sameSite: isProd ? 'none' : 'lax',
  secure: isProd,
});

export { withAuth, session };
