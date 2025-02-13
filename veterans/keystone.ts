import { config } from '@keystone-6/core';
import 'dotenv/config';

import { lists } from './schema';
import { type TypeInfo } from '.keystone/types';

import { Session } from './keystone/access';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';

const sessionSecret = process.env.SESSION_SECRET;

const sessionMaxAge = 60 * 60;

const { withAuth } = createAuth({
  listKey: 'User',

  identityField: 'email',

  secretField: 'password',

  // WARNING: do not use initFirstItem in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    itemData: {
      role: 'Administrator',
    },
    skipKeystoneWelcome: true,
  },

  sessionData: 'id role',
});

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
      maxAge: sessionMaxAge,
      secret: sessionSecret,
    }),
  }),
);
