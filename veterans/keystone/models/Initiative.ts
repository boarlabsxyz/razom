import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import {
  text,
  checkbox,
  select,
  relationship,
  timestamp,
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';

import {
  Session,
  hasSession,
  isAdmin,
  isInitiativeManager,
  isSameUser,
  isAdminOrModerator,
} from '../access';
import { CustomBaseItem } from 'types';

export interface Initiative {
  id: string;
  title: string;
  description?: {
    document?: Array<{
      type: string;
      children?: Array<{
        text?: string;
      }>;
    }>;
  };
  region?: {
    name?: string;
  } | null;
  category?: {
    name?: string;
  } | null;
  source?: {
    name?: string;
  } | null;
  status?: string;
}

export const Initiative = list({
  access: {
    operation: {
      create: ({ session }: { session?: Session }) =>
        isAdminOrModerator({ session }) || isInitiativeManager({ session }),
      update: ({ session }: { session?: Session }) => hasSession({ session }),
      delete: ({ session }: { session?: Session }) => isAdmin({ session }),
      query: allowAll,
    },
    filter: {
      update: async ({ session }: { session?: Session }) => {
        if (isAdminOrModerator({ session })) {
          return true;
        }

        if (isInitiativeManager({ session })) {
          return { createdBy: { id: { equals: session?.itemId } } };
        }

        return false;
      },
    },
  },
  ui: {
    listView: {
      initialColumns: ['title', 'region', 'status', 'createdAt'],
    },
  },
  hooks: {
    resolveInput: async ({ resolvedData, context, operation }) => {
      if (operation === 'create' && context.session?.itemId) {
        return {
          ...resolvedData,
          createdBy: { connect: { id: context.session.itemId } },
        };
      }
      return resolvedData;
    },
  },

  fields: {
    title: text({
      validation: { isRequired: true },
      ui: {
        createView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdminOrModerator({ session }) || isInitiativeManager({ session })
              ? 'edit'
              : 'hidden',
        },
        itemView: {
          fieldMode: ({
            session,
            item,
          }: {
            session?: Session;
            item: CustomBaseItem;
          }) =>
            isAdminOrModerator({ session }) || isSameUser({ session, item })
              ? 'edit'
              : 'read',
        },
      },
    }),

    description: document({
      formatting: true,
      links: true,
      dividers: true,
      hooks: {
        validateInput: async ({ resolvedData, item, addValidationError }) => {
          const description = resolvedData.description || item?.description;

          if (!description || !Array.isArray(description)) {
            addValidationError('Invalid description format.');
            return;
          }

          type SlateNode = {
            type: string;
            children?: SlateNode[];
            text?: string;
          };

          try {
            const hasText = description.some((block: SlateNode) =>
              block.children?.some(
                (child: SlateNode) =>
                  typeof child.text === 'string' &&
                  child.text.trim().length > 0,
              ),
            );

            if (!hasText) {
              addValidationError('Description must contain some text.');
            }
          } catch {
            addValidationError('Invalid description format.');
            return;
          }
        },
      },

      ui: {
        createView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdminOrModerator({ session }) || isInitiativeManager({ session })
              ? 'edit'
              : 'hidden',
        },
        itemView: {
          fieldMode: ({ context, item }) => {
            const session = context.session as Session | undefined;
            return isAdminOrModerator({ session }) ||
              isSameUser({ session, item })
              ? 'edit'
              : 'read';
          },
        },
      },
    }),

    category: relationship({
      ref: 'Category',
      many: false,
      hooks: {
        validateInput: async ({ resolvedData, item, addValidationError }) => {
          const isCategoryBeingRemoved =
            resolvedData.category && 'disconnect' in resolvedData.category;
          const isCategoryMissing =
            (!resolvedData.category?.connect?.id && !item?.categoryId) ||
            isCategoryBeingRemoved;

          if (isCategoryMissing) {
            addValidationError('Category is required.');
          }
        },
      },
      ui: {
        createView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdminOrModerator({ session }) || isInitiativeManager({ session })
              ? 'edit'
              : 'hidden',
        },
        itemView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdmin({ session }) ? 'edit' : 'read',
        },
      },
    }),

    source: relationship({
      ref: 'Source',
      many: false,
      hooks: {
        validateInput: async ({ resolvedData, item, addValidationError }) => {
          const isSourceBeingRemoved =
            resolvedData.source && 'disconnect' in resolvedData.source;
          const isSourceMissing =
            (!resolvedData.source?.connect?.id && !item?.sourceId) ||
            isSourceBeingRemoved;

          if (isSourceMissing) {
            addValidationError('Source is required.');
          }
        },
      },
      ui: {
        createView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdminOrModerator({ session }) || isInitiativeManager({ session })
              ? 'edit'
              : 'hidden',
        },
        itemView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdmin({ session }) ? 'edit' : 'read',
        },
      },
    }),

    region: relationship({
      ref: 'Region',
      many: false,
      ui: {
        createView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdminOrModerator({ session }) || isInitiativeManager({ session })
              ? 'edit'
              : 'hidden',
        },
        itemView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdmin({ session }) ? 'edit' : 'read',
        },
        listView: {
          fieldMode: 'read',
        },
      },
      hooks: {
        validateInput: async ({ resolvedData, item, addValidationError }) => {
          const isRegionBeingRemoved =
            resolvedData.region && 'disconnect' in resolvedData.region;
          const isRegionMissing =
            (!resolvedData.region?.connect?.id && !item?.regionId) ||
            isRegionBeingRemoved;

          if (isRegionMissing) {
            addValidationError('Region is required.');
          }
        },
      },
    }),

    status: select({
      options: [
        { label: 'На розгляді', value: 'pending' },
        { label: 'Схвалено', value: 'approved' },
        { label: 'Відхилено', value: 'rejected' },
      ],
      defaultValue: 'pending',
      validation: { isRequired: true },
      access: {
        read: allowAll,
        update: ({ session }: { session?: Session }) =>
          isAdminOrModerator({ session }),
      },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({ session }: { session?: Session }) =>
            isAdminOrModerator({ session }) ? 'edit' : 'read',
        },
      },
    }),

    archived: checkbox({
      defaultValue: false,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: {
          fieldMode: ({
            session,
            item,
          }: {
            session?: Session;
            item: CustomBaseItem;
          }) =>
            isAdminOrModerator({ session }) || isSameUser({ session, item })
              ? 'edit'
              : 'read',
        },
        listView: { fieldMode: 'read' },
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
