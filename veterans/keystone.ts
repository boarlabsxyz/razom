import { config } from '@keystone-6/core';
import type { BaseKeystoneTypeInfo } from '@keystone-6/core/types';
import 'dotenv/config';

import { lists } from './schema';
import { seedDemoData } from './scripts/seedDemoData';

import { withAuth, session } from './auth';

export default withAuth(
  config<BaseKeystoneTypeInfo>({
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
      onConnect: async (context) => {
        await seedDemoData(context);
      },
    },
    lists,
    session,
  }),
);
