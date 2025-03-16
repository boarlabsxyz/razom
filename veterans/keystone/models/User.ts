import { list } from '@keystone-6/core';
import { allowAll, denyAll } from '@keystone-6/core/access';
import {
  text,
  checkbox,
  password,
  select,
  timestamp,
} from '@keystone-6/core/fields';
import { ListConfig } from '@keystone-6/core';
import type { Lists } from '.keystone/types';

import {
  Session,
  hasSession,
  isAdmin,
  isSameUser,
  isAdminOrModerator,
  isAdminOrSameUser,
  isAdminOrSameUserFilter,
} from '../access';
import { CustomBaseItem } from 'types';

export const User: ListConfig<Lists.User.TypeInfo<Session>> = list({
  access: {
    operation: {
      create: allowAll,
      query: allowAll,
      update: ({ session }: { session?: Session }) => hasSession({ session }),
      delete: ({ session }: { session?: Session }) => isAdmin({ session }),
    },
    filter: {
      update: ({ session }: { session?: Session }) =>
        isAdminOrSameUserFilter({ session }),
    },
    item: {
      update: ({
        session,
        item,
      }: {
        session?: Session;
        item: CustomBaseItem;
      }) => isAdminOrSameUser({ session, item }),
    },
  },
  ui: {
    hideDelete: ({ session }: { session?: Session }) => !isAdmin({ session }),
    listView: {
      initialColumns: ['name', 'role'],
    },
  },
  fields: {
    name: text({
      access: {
        read: allowAll,
        update: ({
          session,
          item,
        }: {
          session?: Session;
          item: CustomBaseItem;
        }) => isAdminOrSameUser({ session, item }),
      },
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: ({
            session,
            item,
          }: {
            session?: Session;
            item: CustomBaseItem;
          }) => (isAdminOrSameUser({ session, item }) ? 'edit' : 'read'),
        },
      },
    }),

    email: text({
      access: {
        read: ({
          session,
          item,
        }: {
          session?: Session;
          item: CustomBaseItem;
        }) => isAdminOrModerator({ session }) || isSameUser({ session, item }),
        update: ({ session, item }) => isSameUser({ session, item }),
      },
      isIndexed: 'unique',
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: ({
            session,
            item,
          }: {
            session?: Session;
            item: CustomBaseItem;
          }) => (isSameUser({ session, item }) ? 'edit' : 'hidden'),
        },
        listView: { fieldMode: 'hidden' },
      },
    }),

    password: password({
      access: {
        read: denyAll,
        update: ({
          session,
          item,
        }: {
          session?: Session;
          item: CustomBaseItem;
        }) => isSameUser({ session, item }),
      },
      validation: { isRequired: true },
      ui: {
        itemView: {
          fieldMode: ({
            session,
            item,
          }: {
            session?: Session;
            item: CustomBaseItem;
          }) => (isSameUser({ session, item }) ? 'edit' : 'hidden'),
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
        create: ({ session }: { session?: Session }) => isAdmin({ session }),
        update: ({ session }: { session?: Session }) => isAdmin({ session }),
      },
      ui: {
        createView: {
          fieldMode: 'hidden',
        },
        itemView: {
          fieldMode: ({
            session,
            item,
          }: {
            session?: Session;
            item: CustomBaseItem;
          }) =>
            isAdmin({ session }) && !isSameUser({ session, item })
              ? 'edit'
              : 'hidden',
        },
      },
    }),

    blocked: checkbox({
      defaultValue: false,
      access: {
        read: allowAll,
        update: ({ session }: { session?: Session }) => isAdmin({ session }),
      },
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
            isAdmin({ session }) && !isSameUser({ session, item })
              ? 'edit'
              : 'hidden',
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
});
