import type { Lists } from '.keystone/types';
import { User } from './keystone/models/User';
import { Initiative } from './keystone/models/Initiative';
import { Category } from './keystone/models/Category';
import { Source } from './keystone/models/Source';
import { Session } from './keystone/access';

export const lists = {
  User,
  Initiative,
  Category,
  Source,
} satisfies Lists<Session>;
