import { KeystoneContext } from '@keystone-6/core/types';
import type { BaseKeystoneTypeInfo } from '@keystone-6/core/types';

import demoInitiatives from '../data/demoInitiatives';

export async function seedDemoData(
  context: KeystoneContext<BaseKeystoneTypeInfo>,
) {
  if ((await context.db.Post.count()) > 0) {
    return;
  }
  for (const initiative of demoInitiatives) {
    await context.db.Post.createOne({ data: initiative });
  }
}
