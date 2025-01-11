import type { Context } from '../node_modules/.keystone/types';

import demoInitiatives from '../data/demoInitiatives';

export async function seedDemoData(context: Context) {
  if ((await context.db.Post.count()) > 0) {
    return;
  }
  for (const initiative of demoInitiatives) {
    await context.db.Post.createOne({ data: initiative });
  }
}
