import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, integer, checkbox } from '@keystone-6/core/fields';
import { Session, isAdmin } from '../access';

export const Region = list({
  access: {
    operation: {
      create: ({ session }: { session?: Session }) => isAdmin({ session }),
      update: ({ session }: { session?: Session }) => isAdmin({ session }),
      delete: ({ session }: { session?: Session }) => isAdmin({ session }),
      query: allowAll,
    },
  },
  fields: {
    name: text({
      validation: { isRequired: true },
      isIndexed: 'unique',
      ui: {
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
        createView: { fieldMode: 'edit' },
      },
    }),
    numOfInitiatives: integer({
      defaultValue: 0,
      ui: {
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
        createView: { fieldMode: 'edit' },
      },
    }),
    isDefault: checkbox({
      defaultValue: false,
      ui: {
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
        createView: { fieldMode: 'edit' },
      },
    }),
    order: integer({
      defaultValue: 0,
      ui: {
        itemView: { fieldMode: 'read' },
        listView: { fieldMode: 'read' },
        createView: { fieldMode: 'edit' },
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'numOfInitiatives', 'order'],
    },
  },
});
