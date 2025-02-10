import { list } from '@keystone-6/core';
import { allowAll, denyAll } from '@keystone-6/core/access';
import {
  text,
  checkbox,
  password,
  select,
  relationship,
  timestamp,
} from '@keystone-6/core/fields';
import type { Lists } from '.keystone/types';

type Session = {
  itemId: string;
  data: {
    role: 'Administrator' | 'Moderator' | 'Initiative Manager' | 'User';
  };
};

function hasSession({ session }: { session?: Session }) {
  return Boolean(session);
}

function isAdmin({ session }: { session?: Session }) {
  return session?.data.role === 'Administrator';
}

function isModerator({ session }: { session?: Session }) {
  return session?.data.role === 'Moderator';
}

function isInitiativeManager({ session }: { session?: Session }) {
  return session?.data.role === 'Initiative Manager';
}

function isSameUser({
  session,
  item,
}: {
  session?: Session;
  item: { id: string };
}) {
  if (!session) {
    return false;
  }
  return session.itemId === item.id;
}

function isAdminOr({ session }: { session?: Session }, condition: boolean) {
  return isAdmin({ session }) || condition;
}

function isAdminOrSameUser({
  session,
  item,
}: {
  session?: Session;
  item: { id: string };
}) {
  return isAdminOr({ session }, isSameUser({ session, item }));
}

function isAdminOrModerator({ session }: { session?: Session }) {
  return isAdminOr({ session }, isModerator({ session }));
}

function isAdminOrSameUserFilter({ session }: { session?: Session }) {
  return isAdmin({ session }) ? {} : { id: { equals: session?.itemId } };
}

export const lists = {
  User: list({
    access: {
      operation: {
        create: allowAll,
        query: allowAll,
        update: ({ session }) => hasSession({ session }),
        delete: ({ session }) => isAdmin({ session }),
      },
      filter: {
        update: ({ session }) => isAdminOrSameUserFilter({ session }),
      },
      item: {
        update: ({ session, item }) => isAdminOrSameUser({ session, item }),
      },
    },
    ui: {
      hideDelete: ({ session }) => !isAdmin({ session }),
      listView: {
        initialColumns: ['name', 'role'],
      },
    },
    fields: {
      name: text({
        access: {
          read: allowAll,
          update: ({ session, item }) => isAdminOrSameUser({ session, item }),
        },
        validation: { isRequired: true },
      }),

      email: text({
        access: {
          read: ({ session, item }) =>
            isAdminOrModerator({ session }) || isSameUser({ session, item }),
          update: ({ session, item }) => isSameUser({ session, item }),
        },
        isIndexed: 'unique',
        validation: { isRequired: true },
        ui: {
          itemView: {
            fieldMode: ({ session, item }) =>
              isSameUser({ session, item }) ? 'edit' : 'hidden',
          },
          listView: { fieldMode: 'hidden' },
        },
      }),

      password: password({
        access: {
          read: denyAll,
          update: ({ session, item }) => isSameUser({ session, item }),
        },
        validation: { isRequired: true },
        ui: {
          itemView: {
            fieldMode: ({ session, item }) =>
              isSameUser({ session, item }) ? 'edit' : 'hidden',
          },
          listView: { fieldMode: 'hidden' },
        },
      }),

      role: select({
        options: [
          { label: 'Administrator', value: 'Administrator' },
          { label: 'Moderator', value: 'Moderator' },
          { label: 'Initiative Manager', value: 'Initiative Manager' },
          { label: 'User', value: 'User' },
        ],
        defaultValue: 'User',
        validation: { isRequired: true },
        access: {
          read: allowAll,
          create: ({ session }) => isAdmin({ session }),
          update: ({ session }) => isAdmin({ session }),
        },
        ui: {
          createView: {
            fieldMode: ({ session }) =>
              isAdmin({ session }) ? 'edit' : 'hidden',
          },
          itemView: {
            fieldMode: ({ session }) =>
              isAdmin({ session }) ? 'edit' : 'hidden',
          },
        },
      }),

      blocked: checkbox({
        defaultValue: false,
        access: {
          read: allowAll,
          update: ({ session }) => isAdmin({ session }),
        },
        ui: {
          itemView: {
            fieldMode: ({ session }) =>
              isAdmin({ session }) ? 'edit' : 'hidden',
          },
          listView: { fieldMode: 'hidden' },
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
  }),

  Initiative: list({
    access: {
      operation: {
        create: ({ session }) =>
          isAdminOrModerator({ session }) || isInitiativeManager({ session }),
        update: ({ session }) => hasSession({ session }),
        delete: ({ session }) => isAdmin({ session }),
        query: allowAll,
      },
      filter: {
        update: async ({ session }) => {
          if (isAdminOrModerator({ session })) {
            return true;
          }

          if (isInitiativeManager({ session }) && session) {
            return { createdBy: { id: { equals: session.itemId } } };
          }

          return false;
        },
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
      title: text({ validation: { isRequired: true } }),

      description: text({ validation: { isRequired: true } }),

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
              isAdminOrModerator({ session }) ||
              isInitiativeManager({ session })
                ? 'edit'
                : 'hidden',
          },
          itemView: {
            fieldMode: ({ session }) =>
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
              isAdminOrModerator({ session }) ||
              isInitiativeManager({ session })
                ? 'edit'
                : 'hidden',
          },
          itemView: {
            fieldMode: ({ session }) =>
              isAdmin({ session }) ? 'edit' : 'read',
          },
        },
      }),

      status: select({
        options: [
          { label: 'Approved', value: 'approved' },
          { label: 'Rejected', value: 'rejected' },
          { label: 'Draft', value: 'draft' },
        ],
        defaultValue: 'draft',
        validation: { isRequired: true },
        access: {
          read: allowAll,
          update: ({ session }) => isAdminOrModerator({ session }),
        },
        ui: {
          createView: {
            fieldMode: 'hidden',
          },
          itemView: {
            fieldMode: ({ session }) =>
              isAdminOrModerator({ session }) ? 'edit' : 'read',
          },
        },
      }),

      archived: checkbox({
        defaultValue: false,
        ui: {
          createView: { fieldMode: 'hidden' },
          itemView: { fieldMode: 'edit' },
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
  }),

  Category: list({
    access: {
      operation: {
        create: ({ session }) => isAdminOrModerator({ session }),
        update: ({ session }) => isAdminOrModerator({ session }),
        delete: ({ session }) => isAdminOrModerator({ session }),
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
            fieldMode: ({ session }) =>
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
  }),

  Source: list({
    access: {
      operation: {
        create: ({ session }) => isAdminOrModerator({ session }),
        update: ({ session }) => isAdminOrModerator({ session }),
        delete: ({ session }) => isAdminOrModerator({ session }),
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
            fieldMode: ({ session }) =>
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
  }),
} satisfies Lists<Session>;
