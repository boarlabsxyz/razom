import { config } from '@keystone-6/core';
import 'dotenv/config';

import cors from 'cors';

import { lists } from './schema';
import { type TypeInfo } from '.keystone/types';

import { Session } from './keystone/access';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';
import { CorsCallback } from 'types';

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
    return false;
  }

  const allowed = [
    'http://localhost:3000',
    'http://localhost:8000',
    'https://razom.vercel.app',
    'https://razom-production.up.railway.app',
  ];

  return allowed.includes(origin) || origin.endsWith('.vercel.app');
};

export const corsOptions = {
  origin: (requestOrigin: string | undefined, callback: CorsCallback) => {
    if (!requestOrigin || allowedOrigins(requestOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-apollo-operation-name',
    'apollo-require-preflight',
  ],
};

export default withAuth<TypeInfo<Session>>(
  config<TypeInfo>({
    db: {
      provider: 'postgresql',
      url: (() => {
        if (!process.env.DATABASE_URL) {
          throw new Error(
            'DEVELOPMENT_DATABASE_URL environment variable is not set',
          );
        }
        return process.env.DATABASE_URL;
      })(),
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
    graphql: {
      path: '/api/graphql',
      cors: {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:8000',
          'https://*.vercel.app',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
      apolloConfig: {
        csrfPrevention: false,
      },
    },
    server: {
      extendExpressApp: (app) => {
        app.use(cors(corsOptions));
      },
      cors: {
        origin: [
          process.env.FRONTEND_URL || 'http://localhost:8000',
          'https://*.vercel.app',
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
    },
  }),
);
