import {
  hasSession,
  isAdmin,
  isModerator,
  isInitiativeManager,
  isSameUser,
  isAdminOr,
  isAdminOrSameUser,
  isAdminOrModerator,
  isAdminOrSameUserFilter,
} from './access';

const mockUser = {
  id: 'testId',
  name: 'testName',
  email: 'testEmail',
  password: 'testPassword',
  role: 'testRole',
  blocked: false,
  createdAt: new Date(),
};

const mockInitiative = {
  id: '123',
  createdById: 'testId',
};

describe('Session-based functions', () => {
  const mockSession = (
    role: 'Administrator' | 'Moderator' | 'Initiative Manager' | 'User',
  ) => ({
    itemId: 'testId',
    data: { role },
  });

  describe('hasSession', () => {
    it('should return true if session exists', () => {
      expect(hasSession({ session: mockSession('Administrator') })).toBe(true);
    });

    it('should return false if session does not exist', () => {
      expect(hasSession({ session: undefined })).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should return true if user is admin', () => {
      expect(isAdmin({ session: mockSession('Administrator') })).toBe(true);
    });

    it('should return false if user is not admin', () => {
      expect(isAdmin({ session: mockSession('User') })).toBe(false);
    });
  });

  describe('isModerator', () => {
    it('should return true if user is moderator', () => {
      expect(isModerator({ session: mockSession('Moderator') })).toBe(true);
    });

    it('should return false if user is not moderator', () => {
      expect(isModerator({ session: mockSession('User') })).toBe(false);
    });
  });

  describe('isInitiativeManager', () => {
    it('should return true if user is initiative manager', () => {
      expect(
        isInitiativeManager({ session: mockSession('Initiative Manager') }),
      ).toBe(true);
    });

    it('should return false if user is not initiative manager', () => {
      expect(isInitiativeManager({ session: mockSession('User') })).toBe(false);
    });
  });

  describe('isSameUser', () => {
    it('should return true if session user is the same as the item creator', () => {
      expect(
        isSameUser({
          session: mockSession('Administrator'),
          item: mockInitiative,
        }),
      ).toBe(true);
    });

    it('should return false if session user is different from the item creator', () => {
      mockInitiative.createdById = '456';
      expect(
        isSameUser({
          session: mockSession('Administrator'),
          item: mockInitiative,
        }),
      ).toBe(false);
    });

    it('should return false if session is undefined', () => {
      expect(isSameUser({ session: undefined, item: mockUser })).toBe(false);
    });
  });

  describe('isAdminOr', () => {
    it('should return true if user is admin', () => {
      expect(isAdminOr({ session: mockSession('Administrator') }, false)).toBe(
        true,
      );
    });

    it('should return true if condition is true', () => {
      expect(isAdminOr({ session: mockSession('User') }, true)).toBe(true);
    });

    it('should return false if user is not admin and condition is false', () => {
      expect(isAdminOr({ session: mockSession('User') }, false)).toBe(false);
    });
  });

  describe('isAdminOrSameUser', () => {
    const mockItem = { id: '123', createdById: '123' };

    it('should return true if user is admin', () => {
      expect(
        isAdminOrSameUser({
          session: mockSession('Administrator'),
          item: mockUser,
        }),
      ).toBe(true);
    });

    it('should return true if user is same as the item creator', () => {
      expect(
        isAdminOrSameUser({ session: mockSession('User'), item: mockUser }),
      ).toBe(true);
    });

    it('should return false if user is not admin and not the same as the item creator', () => {
      mockItem.createdById = '456';
      expect(
        isAdminOrSameUser({
          session: mockSession('User'),
          item: mockInitiative,
        }),
      ).toBe(false);
    });
  });

  describe('isAdminOrModerator', () => {
    it('should return true if user is admin', () => {
      expect(
        isAdminOrModerator({ session: mockSession('Administrator') }),
      ).toBe(true);
    });

    it('should return true if user is moderator', () => {
      expect(isAdminOrModerator({ session: mockSession('Moderator') })).toBe(
        true,
      );
    });

    it('should return false if user is neither admin nor moderator', () => {
      expect(isAdminOrModerator({ session: mockSession('User') })).toBe(false);
    });
  });

  describe('isAdminOrSameUserFilter', () => {
    it('should return an empty object if user is admin', () => {
      expect(
        isAdminOrSameUserFilter({ session: mockSession('Administrator') }),
      ).toEqual({});
    });

    it('should return filter object if user is not admin', () => {
      expect(isAdminOrSameUserFilter({ session: mockSession('User') })).toEqual(
        {
          id: { equals: 'testId' },
        },
      );
    });
  });
});
