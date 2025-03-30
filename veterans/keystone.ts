import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';

const checkEnvVariables = () => {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error(
      'SESSION_SECRET must be set and at least 32 characters long',
    );
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
  }
};

checkEnvVariables();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is required');
}

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : [process.env.FRONTEND_URL as string];

const corsConfig = {
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
};

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: databaseUrl,
      onConnect: async () => {
        // eslint-disable-next-line no-console
        console.log('✅ Successfully connected to the database.');
      },
    },
    lists,
    session,
    server: {
      cors: corsConfig,
      port: Number(process.env.BACKEND_PORT) || 3000,
    },
    graphql: {
      path: '/api/graphql',
      cors: corsConfig,
    },
  }),
);
