import { authConfig } from './auth.config';
import type { Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Account, Profile } from 'next-auth';

describe('Auth Configuration', () => {
  describe('providers', () => {
    it('should have Google provider configured', () => {
      expect(authConfig.providers).toHaveLength(1);
      const [googleProvider] = authConfig.providers;
      expect(googleProvider.id).toBe('google');
    });
  });

  describe('pages', () => {
    it('should have correct sign in page configured', () => {
      expect(authConfig.pages?.signIn).toBe('/login');
    });
  });

  describe('callbacks', () => {
    describe('session callback', () => {
      it('should add user id from token', async () => {
        const mockSession: Session = {
          user: {
            name: 'Test User',
            email: 'test@example.com',
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
        const mockToken: JWT = {
          sub: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          jti: 'test-jwt-id',
        };

        const mockUser = {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: null,
        };

        const result = await authConfig.callbacks?.session?.({
          session: mockSession,
          token: mockToken,
          user: mockUser,
          newSession: mockSession,
          trigger: 'update',
        });

        expect(result).toEqual({
          ...mockSession,
          user: {
            ...mockSession.user,
            id: 'user123',
          },
        });
      });
    });

    describe('jwt callback', () => {
      it('should add profile id to token', async () => {
        const mockToken: JWT = {
          name: 'Test User',
          email: 'test@example.com',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          jti: 'test-jwt-id',
        };
        const mockAccount: Account = {
          provider: 'google',
          type: 'oauth',
          providerAccountId: 'test-account-id',
          access_token: 'test-access-token',
          token_type: 'Bearer',
          scope: 'openid profile email',
          id_token: 'test-id-token',
        };
        const mockProfile: Profile & { sub: string } = {
          sub: 'profile123',
          name: 'Test User',
          email: 'test@example.com',
        };
        const mockUser = {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: null,
        };

        const result = await authConfig.callbacks?.jwt?.({
          token: mockToken,
          account: mockAccount,
          profile: mockProfile,
          user: mockUser,
          trigger: 'signIn',
        });

        expect(result).toEqual({
          ...mockToken,
          id: 'profile123',
        });
      });

      it('should return unchanged token when no account or profile', async () => {
        const mockToken: JWT = {
          name: 'Test User',
          email: 'test@example.com',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          jti: 'test-jwt-id',
        };
        const mockUser = {
          id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          emailVerified: null,
        };

        const result = await authConfig.callbacks?.jwt?.({
          token: mockToken,
          user: mockUser,
          account: null,
          trigger: 'update',
        });

        expect(result).toEqual(mockToken);
      });
    });
  });
});
