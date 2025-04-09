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

// Debug: show the environment
// eslint-disable-next-line no-console
console.log('🛠️ NODE_ENV:', process.env.NODE_ENV);

const databaseUrl = process.env.DATABASE_URL!;
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:8000'];

const vercelPattern = /^https:\/\/razom-.*-kavoon\.vercel\.app$/;
const isVercelDeployment = (origin: string) => vercelPattern.test(origin);

const corsConfig = !process.env.NODE_ENV
  ? {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
    }
  : {
      origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) => {
        if (!origin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || isVercelDeployment(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
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
