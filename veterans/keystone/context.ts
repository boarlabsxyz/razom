import keystoneConfig from '../keystone';
import { PrismaClient } from '@prisma/client';
import { Context } from '.keystone/types';

const prisma = new PrismaClient();

let keystoneContext: Context | null = null;

export const getKeystoneContext = async (): Promise<Context> => {
  if (!keystoneContext) {
    const { getContext } = await import('@keystone-6/core/context');
    keystoneContext = getContext(keystoneConfig, prisma);
  }
  return keystoneContext;
};
