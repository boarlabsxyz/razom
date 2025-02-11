import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, timestamp } from '@keystone-6/core/fields';

import { Session, isAdminOrModerator } from '../access';

export const Source = list({
  access: {
    operation: {
      create: ({ session }: { session?: Session }) =>
        isAdminOrModerator({ session }),
      update: ({ session }: { session?: Session }) =>
        isAdminOrModerator({ session }),
      delete: ({ session }: { session?: Session }) =>
        isAdminOrModerator({ session }),
      query: allowAll,
    },
  },

  fields: {
    title: text({
      validation: { isRequired: true },
      ui: {
        createView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdminOrModerator({ session }) ? 'edit' : 'hidden',
        },
        itemView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdminOrModerator({ session }) ? 'edit' : 'read',
        },
      },
    }),

    createdBy: relationship({
      ref: 'User',
      many: false,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),

    createdAt: timestamp({
      defaultValue: { kind: 'now' },
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
});
