import '@testing-library/jest-dom';
import NextAuth from 'next-auth';

import { authOptions, GET, POST } from './route';

describe('NextAuth Configuration', () => {
  describe('authOptions', () => {
    it('should configure Google provider', () => {
      expect(authOptions.providers).toHaveLength(1);
      const provider = authOptions.providers[0];

      expect(provider.id).toBe('google');

      expect(provider.clientId).toBe(process.env.GOOGLE_CLIENT_ID);
      expect(provider.clientSecret).toBe(process.env.GOOGLE_CLIENT_SECRET);
    });
  });

  describe('handlers', () => {
    it('should export GET and POST handlers', () => {
      expect(GET).toBeDefined();
      expect(POST).toBeDefined();
    });

    it('should initialize NextAuth with correct options', () => {
      const nextAuthInstance = NextAuth(authOptions);
      expect(nextAuthInstance).toBeDefined();
    });
  });
});
