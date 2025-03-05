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

const allowedOrigins = (origin: string | undefined) => {
  if (!origin) {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return (
      origin === 'https://razom.vercel.app' || origin.includes('localhost:3000')
    );
  }

  return (
    origin.includes('localhost:3000') ||
    origin.includes('localhost:8000') ||
    origin.endsWith('.vercel.app')
  );
};

export const corsOptions = {
  origin: ((
    requestOrigin: string | undefined,
    callback: (err: Error | null, allow?: string | boolean) => void,
  ) => {
    if (allowedOrigins(requestOrigin)) {
      callback(null, requestOrigin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }) as unknown as string | string[],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

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
      cors: corsOptions,
    },
  }),
);
