import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { text, relationship, timestamp } from '@keystone-6/core/fields';
import { Session, isAdminOrModerator } from '../access';

export const commonTaxonomyModel = () =>
  list({
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
        validation: {
          isRequired: true,
          length: { min: 3, max: 100 },
        },
        hooks: {
          resolveInput: ({ resolvedData }) => resolvedData.title?.trim(),
        },
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
        hooks: {
          resolveInput: ({ operation, context }) => {
            if (operation === 'create') {
              return { connect: { id: context.session?.itemId } };
            }
            return undefined;
          },
        },
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

export const Category = commonTaxonomyModel();

export const Source = commonTaxonomyModel();
