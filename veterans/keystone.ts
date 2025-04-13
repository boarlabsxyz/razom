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

const databaseUrl = process.env.DATABASE_URL!;
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:8000'];

const vercelPattern = /^https:\/\/razom-.*-kavoon\.vercel\.app$/;
const isVercelDeployment = (origin: string) => vercelPattern.test(origin);

const isGitHubAction = process.env.IS_GITHUB_ACTION === 'true';
const isProduction = process.env.NODE_ENV === 'production';

const corsConfig = isGitHubAction
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
      extendExpressApp: (app) => {
        if (isProduction) {
          app.get('/', (req, res) => {
            res.json({ status: 'ok' });
          });
        }
      },
    },
    graphql: {
      path: '/api/graphql',
      cors: corsConfig,
    },
    ui: isProduction ? { isDisabled: true } : {},
  }),
);
