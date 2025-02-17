/* eslint-disable no-console */
import { KeystoneContext } from '@keystone-6/core/types';
import type { BaseKeystoneTypeInfo } from '@keystone-6/core/types';
import type { PrismaClient } from '@prisma/client';

import demoInitiatives from '../data/demoInitiatives';

export async function seedDemoData(
  context: KeystoneContext<BaseKeystoneTypeInfo>,
) {
  try {
    console.log('Checking existing initiatives...');
    const existingCount = await context.db.Initiative.count();
    if (existingCount > 0) {
      console.log('Initiatives already exist, skipping seed');
      return;
    }

    console.log(`Seeding ${demoInitiatives.length} initiatives...`);

    await context.prisma.$transaction(async (prisma: PrismaClient) => {
      for (const initiative of demoInitiatives) {
        await prisma.initiative.create({
          data: initiative,
        });
      }
    });

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding demo data:', error);
    throw error;
  }
}
