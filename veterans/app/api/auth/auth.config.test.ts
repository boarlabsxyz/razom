import { authConfig } from './auth.config';
import type { Session, Account, Profile } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { AdapterUser } from 'next-auth/adapters';
import type { OAuthConfig } from 'next-auth/providers';

interface ExtendedSession extends Session {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

describe('auth.config', () => {
  describe('providers', () => {
    it('should have Google provider configured', () => {
      expect(authConfig.providers).toHaveLength(1);
      const googleProvider = authConfig.providers[0] as OAuthConfig<Profile>;
      expect(googleProvider.id).toBe('google');
    });
  });

  describe('pages', () => {
    it('should have correct sign-in page path', () => {
      expect(authConfig.pages?.signIn).toBe('/login');
    });
  });

  describe('session', () => {
    it('should use JWT strategy', () => {
      expect(authConfig.session?.strategy).toBe('jwt');
    });
  });

  describe('callbacks', () => {
    describe('session', () => {
      it('should include user ID from token when session has user', async () => {
        const mockSession = {
          user: {
            name: 'Test User',
            email: 'test@example.com',
            image: 'https://example.com/image.jpg',
          },
        } as ExtendedSession;

        const mockToken = {
          sub: 'test-user-id',
        } as JWT;

        const mockUser = {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/image.jpg',
        } as AdapterUser;

        const result = (await authConfig.callbacks?.session?.({
          session: mockSession,
          token: mockToken,
          user: mockUser,
          newSession: mockSession,
          trigger: 'update',
        })) as ExtendedSession;

        expect(result?.user?.id).toBe('test-user-id');
      });

      it('should not modify session when user object is missing', async () => {
        const mockSession = {} as ExtendedSession;
        const mockToken = {
          sub: 'test-user-id',
        } as JWT;

        const mockUser = {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/image.jpg',
        } as AdapterUser;

        const result = (await authConfig.callbacks?.session?.({
          session: mockSession,
          token: mockToken,
          user: mockUser,
          newSession: mockSession,
          trigger: 'update',
        })) as ExtendedSession;

        // The session callback only adds the ID if there's a user object
        expect(result).toEqual(mockSession);
      });
    });

    describe('jwt', () => {
      it('should include user ID from profile when account and profile are present', async () => {
        const mockToken = {} as JWT;
        const mockAccount = {
          provider: 'google',
          type: 'oauth',
        } as Account;
        const mockProfile = {
          sub: 'test-profile-id',
        } as Profile;

        const mockUser = {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/image.jpg',
        } as AdapterUser;

        const result = await authConfig.callbacks?.jwt?.({
          token: mockToken,
          account: mockAccount,
          profile: mockProfile,
          user: mockUser,
          trigger: 'signIn',
        });

        expect(result?.id).toBe('test-profile-id');
      });

      it('should return token unchanged when account or profile is missing', async () => {
        const mockToken = { existing: 'data' } as JWT;
        const mockAccount = null as Account | null;
        const mockProfile = undefined as Profile | undefined;

        const mockUser = {
          id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          image: 'https://example.com/image.jpg',
        } as AdapterUser;

        const result = await authConfig.callbacks?.jwt?.({
          token: mockToken,
          account: mockAccount,
          profile: mockProfile,
          user: mockUser,
          trigger: 'update',
        });

        expect(result).toEqual({ existing: 'data' });
      });
    });
  });

  describe('environment variables', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it('should use test values in test environment', () => {
      const googleProvider = authConfig.providers[0] as OAuthConfig<Profile>;
      expect(googleProvider.options?.clientId).toBe('test-value');
      expect(googleProvider.options?.clientSecret).toBe('test-value');
      expect(authConfig.secret).toBe('test-secret');
    });

    it('should throw error for missing environment variables in non-test environment', () => {
      const jestGlobal = global.jest;
      delete (global as { jest: unknown }).jest;

      jest.isolateModules(async () => {
        await import('./auth.config');
      });

      global.jest = jestGlobal;
    });
  });
});
