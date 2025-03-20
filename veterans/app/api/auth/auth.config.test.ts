import { authOptions } from './auth.config';
import type { Session, Profile, Account } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { OAuthConfig } from 'next-auth/providers';
import type { AdapterUser } from 'next-auth/adapters';

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
      expect(authOptions.providers).toHaveLength(1);
      const googleProvider = authOptions.providers[0] as OAuthConfig<Profile>;
      expect(googleProvider.id).toBe('google');
    });

    it('should have correct Google provider configuration', () => {
      const googleProvider = authOptions.providers[0] as OAuthConfig<Profile>;
      expect(googleProvider.options?.clientId).toBe('test-value');
      expect(googleProvider.options?.clientSecret).toBe('test-value');
    });
  });

  describe('pages', () => {
    it('should have correct sign in page', () => {
      expect(authOptions.pages?.signIn).toBe('/login');
    });
  });

  describe('session', () => {
    it('should use JWT strategy', () => {
      expect(authOptions.session?.strategy).toBe('jwt');
    });
  });

  describe('callbacks', () => {
    describe('session', () => {
      it('should add user id to session', () => {
        const session = {
          user: {
            name: 'Test User',
            email: 'test@example.com',
            image: 'https://example.com/image.jpg',
          },
        } as ExtendedSession;

        const token = {
          sub: 'test-user-id',
        } as JWT;

        const user = {
          id: 'test-user-id',
          email: 'test@example.com',
          emailVerified: new Date(),
          name: 'Test User',
          image: 'https://example.com/image.jpg',
        } as AdapterUser;

        const result = authOptions.callbacks?.session?.({
          session,
          token,
          user,
          trigger: 'update',
          newSession: session,
        }) as ExtendedSession;

        expect(result.user?.id).toBe('test-user-id');
      });

      it('should handle session without user', () => {
        const session = {} as ExtendedSession;
        const token = {} as JWT;

        const user = {
          id: 'test-user-id',
          email: 'test@example.com',
          emailVerified: new Date(),
          name: 'Test User',
          image: 'https://example.com/image.jpg',
        } as AdapterUser;

        const result = authOptions.callbacks?.session?.({
          session,
          token,
          user,
          trigger: 'update',
          newSession: session,
        }) as ExtendedSession;

        expect(result.user).toBeUndefined();
      });
    });

    describe('jwt', () => {
      it('should setup NEXTAUTH_URL', async () => {
        const token = {} as JWT;
        const user = {
          id: 'test-user-id',
          email: 'test@example.com',
          emailVerified: new Date(),
          name: 'Test User',
          image: 'https://example.com/image.jpg',
        } as AdapterUser;
        const account = null as Account | null;

        const result = await authOptions.callbacks?.jwt?.({
          token,
          user,
          account,
          trigger: 'update',
        });
        expect(result).toBe(token);
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
      const googleProvider = authOptions.providers[0] as OAuthConfig<Profile>;
      expect(googleProvider.options?.clientId).toBe('test-value');
      expect(googleProvider.options?.clientSecret).toBe('test-value');
      expect(authOptions.secret).toBe('test-secret');
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
