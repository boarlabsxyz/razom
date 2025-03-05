/* eslint-disable @typescript-eslint/no-explicit-any */
import { getContext } from '@keystone-6/core/context';
import config from 'keystone';
import * as PrismaModule from '.prisma/client';

export const keystoneContext = (() => {
  try {
    return (
      (globalThis as any).keystoneContext ?? getContext(config, PrismaModule)
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize Keystone context:', error);
    throw error;
  }
})();

if (process.env.NODE_ENV !== 'production') {
  (globalThis as any).keystoneContext = keystoneContext;
}
