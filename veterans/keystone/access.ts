import { CustomBaseItem } from 'types';

export type Session = {
  itemId: string;
  data: {
    role: 'Administrator' | 'Moderator' | 'Initiative Manager' | 'User';
  };
};

export function hasSession({ session }: { session?: Session }) {
  return Boolean(session);
}

export function isAdmin({ session }: { session?: Session }) {
  return session?.data.role === 'Administrator';
}

export function isModerator({ session }: { session?: Session }) {
  return session?.data.role === 'Moderator';
}

export function isInitiativeManager({ session }: { session?: Session }) {
  return session?.data.role === 'Initiative Manager';
}

export function isSameUser({
  session,
  item,
}: {
  session?: Session;
  item: CustomBaseItem;
}) {
  if (!session) {
    return false;
  }

  if ('createdById' in item) {
    return session.itemId === item.createdById;
  }

  return session.itemId === item.id;
}

export function isAdminOr(
  { session }: { session?: Session },
  condition: boolean,
) {
  return isAdmin({ session }) || condition;
}

export function isAdminOrSameUser({
  session,
  item,
}: {
  session?: Session;
  item: CustomBaseItem;
}) {
  return isAdminOr({ session }, isSameUser({ session, item }));
}

export function isAdminOrModerator({ session }: { session?: Session }) {
  return isAdminOr({ session }, isModerator({ session }));
}

export function isAdminOrSameUserFilter({ session }: { session?: Session }) {
  return isAdmin({ session }) ? {} : { id: { equals: session?.itemId } };
}
