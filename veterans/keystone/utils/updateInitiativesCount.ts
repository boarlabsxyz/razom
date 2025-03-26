/* eslint-disable no-console */
import { KeystoneContext } from '@keystone-6/core/types';

export async function updateInitiativesCount(
  context: KeystoneContext,
  regionId: string | null,
) {
  try {
    if (!context || !context.db) {
      console.error('Keystone context is not initialized.');
      return;
    }

    const allRegions = await context.db.Region.findMany({
      where: { name: { equals: 'Всі' } },
    });
    if (allRegions.length > 0) {
      const totalInitiatives = await context.db.Initiative.count({
        where: {
          archived: { equals: false },
          status: { equals: 'approved' },
        },
      });
      await context.db.Region.updateOne({
        where: { id: String(allRegions[0].id) },
        data: { numOfInitiatives: totalInitiatives },
      });
    } else {
      console.warn("Region with name 'Всі' not found.");
    }

    if (regionId) {
      const regionInitiativesCount = await context.db.Initiative.count({
        where: {
          region: { id: { equals: regionId } },
          archived: { equals: false },
          status: { equals: 'approved' },
        },
      });
      await context.db.Region.updateOne({
        where: { id: regionId },
        data: { numOfInitiatives: regionInitiativesCount },
      });
    }

    const allOtherRegions = await context.db.Region.findMany({
      where: { name: { not: { equals: 'Всі' } } },
    });

    for (const region of allOtherRegions) {
      const regionInitiativesCount = await context.db.Initiative.count({
        where: {
          region: { id: { equals: String(region.id) } },
          archived: { equals: false },
          status: { equals: 'approved' },
        },
      });
      await context.db.Region.updateOne({
        where: { id: String(region.id) },
        data: { numOfInitiatives: regionInitiativesCount },
      });
    }
  } catch (error) {
    console.error('Помилка при оновленні кількості ініціатив:', error);
  }
}
