// import path from 'node:path';
import { test, beforeEach } from '@jest/globals';

// import { getContext } from '@keystone-6/core/context';
// import { resetDatabase } from '@keystone-6/core/testing';
// import * as PrismaModule from '.prisma/client';
// import baseConfig from './keystone';

// const dbUrl = `file:./test-${process.env.JEST_WORKER_ID}.db`;
// const prismaSchemaPath = path.join(__dirname, 'schema.prisma');
// const config = { ...baseConfig, db: { ...baseConfig.db, url: dbUrl } };

beforeEach(async () => {
  // await resetDatabase(dbUrl, prismaSchemaPath);
});

// const context = getContext(config, PrismaModule);

test('Your unit test', async () => {});
