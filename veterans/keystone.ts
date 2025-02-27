import { config } from '@keystone-6/core';
import 'dotenv/config';

import { lists } from './schema';
import { type TypeInfo } from '.keystone/types';

import { Session } from './keystone/access';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error(
    'SESSION_SECRET environment variable must be set and at least 32 characters long',
  );
}

const sessionSecret = process.env.SESSION_SECRET;

const sessionMaxAge = 60 * 60;

const { withAuth } = createAuth({
  listKey: 'User',

  identityField: 'email',

  secretField: 'password',

  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      role: 'Administrator',
    },
    skipKeystoneWelcome: true,
  },

  sessionData: 'id role',
});

const envAllowedUrls = process.env.ALLOWED_FRONTEND_URL?.split(',') || [];

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validUrls = envAllowedUrls.filter(isValidUrl);
if (envAllowedUrls.length && !validUrls.length) {
  throw new Error('ALLOWED_FRONTEND_URL contains invalid URLs');
}

// const nodeEnv = process.env.NODE_ENV;

// let allowedFrontends = validUrls;

// if (!allowedFrontends.length) {
//   if (nodeEnv === 'production') {
//     allowedFrontends = ['https://razom.vercel.app'];
//   } else if (nodeEnv === 'test') {
//     allowedFrontends = ['*'];
//   } else {
//     allowedFrontends = ['http://localhost:8000'];
//   }
// }

// console.log('Allowed Origins:', allowedFrontends);

export default withAuth<TypeInfo<Session>>(
  config<TypeInfo>({
    db: {
      provider: 'postgresql',
      url: (() => {
        switch (process.env.NODE_ENV) {
          case 'production':
            if (!process.env.PRODUCTION_DATABASE_URL) {
              throw new Error(
                'PRODUCTION_DATABASE_URL environment variable is not set',
              );
            }
            return process.env.PRODUCTION_DATABASE_URL;
          case 'test':
            if (!process.env.TEST_DATABASE_URL) {
              throw new Error(
                'TEST_DATABASE_URL environment variable is not set',
              );
            }
            return process.env.TEST_DATABASE_URL;
          default:
            if (!process.env.DEVELOPMENT_DATABASE_URL) {
              throw new Error(
                'DEVELOPMENT_DATABASE_URL environment variable is not set',
              );
            }
            return process.env.DEVELOPMENT_DATABASE_URL;
        }
      })(),
      // TODO implement according to new structure of Initiative
      // onConnect: async (context) => {
      // await seedDemoData(context);
      // },
    },
    lists,
    session: statelessSessions({
      maxAge: sessionMaxAge || 3600,
      secret:
        sessionSecret ||
        (() => {
          throw new Error('Session secret is required for stateless sessions');
        })(),
    }),
    server: {
      // cors: {
      //   origin: allowedFrontends,
      //   credentials: nodeEnv !== 'test',
      // },
      cors: {
        origin: '*',
        credentials: true,
      },
    },
  }),
);
