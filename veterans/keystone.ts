import { config } from '@keystone-6/core';
import { lists } from './schema';
import { withAuth, session } from './auth';

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error(
    'SESSION_SECRET environment variable must be set and at least 32 characters long',
  );
}

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url:
        process.env.DATABASE_URL || process.env.DEVELOPMENT_DATABASE_URL || '',
      onConnect: async () => {
        // Database connection successful
      },
    },
    lists,
    session,
    server: {
      cors: {
        origin: [
          'http://localhost:8000',
          'https://razom-production.up.railway.app',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
      },
    },
    graphql: {
      path: '/api/graphql',
      cors: {
        origin: [
          'http://localhost:8000',
          'https://razom-production.up.railway.app',
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
      },
    },
  }),
);
