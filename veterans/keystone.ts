import { config } from '@keystone-6/core';
import 'dotenv/config';

import { lists } from './schema';

import { withAuth, session } from './auth';

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: (() => {
        if (!process.env.DATABASE_URL) {
          throw new Error('DATABASE_URL environment variable is not set');
        }
        return process.env.DATABASE_URL;
      })(),
    },
    lists,
    session,
  }),
);
