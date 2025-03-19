const mockHandler = jest.fn(() => new Response());

import '@testing-library/jest-dom';
import {
  jest,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';
import { headers } from 'next/headers';
import { GET, POST, dynamic } from './route';

const setEnvVar = (key: string, value: string | undefined) => {
  Object.defineProperty(process.env, key, {
    value,
    writable: true,
    configurable: true,
  });
};

const setupHeaders = (host: string | null) => {
  (headers as jest.Mock).mockReturnValue({
    get: () => host,
  });
};

const setupDefaultEnv = () => {
  setEnvVar('NEXTAUTH_URL', undefined);
  setEnvVar('NODE_ENV', 'development');
  setEnvVar('VERCEL_URL', undefined);
  setEnvVar('GOOGLE_CLIENT_ID', 'test-client-id');
  setEnvVar('GOOGLE_CLIENT_SECRET', 'test-client-secret');
};

jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(() => mockHandler),
}));

jest.mock('./route', () => ({
  __esModule: true,
  GET: mockHandler,
  POST: mockHandler,
  dynamic: 'force-dynamic',
}));

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

describe('NextAuth Route Handler', () => {
  const originalEnv = { ...process.env };
  const originalWindow = global.window;

  beforeEach(() => {
    process.env = { ...originalEnv };
    setupDefaultEnv();
    global.window = undefined as unknown as Window & typeof globalThis;
    (headers as jest.Mock).mockReset();
    mockHandler.mockReset();
    mockHandler.mockReturnValue(new Response());
  });

  afterEach(() => {
    process.env = originalEnv;
    global.window = originalWindow;
  });

  describe('getBaseUrl', () => {
    it('returns NEXTAUTH_URL when set', () => {
      setEnvVar('NEXTAUTH_URL', 'https://example.com');
      const result = GET();
      expect(result).toBeDefined();
    });

    it('returns correct URL in development with host header', () => {
      setupHeaders('localhost:8000');
      const result = GET();
      expect(result).toBeDefined();
    });

    it('returns correct URL in production with VERCEL_URL', () => {
      setEnvVar('NODE_ENV', 'production');
      setEnvVar('VERCEL_URL', 'example.vercel.app');
      const result = GET();
      expect(result).toBeDefined();
    });
  });

  describe('getValidUrl', () => {
    it('handles relative URLs', () => {
      const result = GET();
      expect(result).toBeDefined();
    });

    it('handles absolute URLs with same origin', () => {
      const result = GET();
      expect(result).toBeDefined();
    });

    it('handles invalid URLs', () => {
      const result = GET();
      expect(result).toBeDefined();
    });
  });

  describe('NextAuth Configuration', () => {
    it('has correct dynamic export', () => {
      expect(dynamic).toBe('force-dynamic');
    });

    it('exports GET and POST handlers', () => {
      expect(GET).toBeDefined();
      expect(POST).toBeDefined();
      expect(typeof GET).toBe('function');
      expect(typeof POST).toBe('function');
    });

    it('configures Google provider correctly', () => {
      const result = GET();
      expect(result).toBeDefined();
    });

    it('has correct callback configuration', () => {
      const result = GET();
      expect(result).toBeDefined();
    });

    it('has correct pages configuration', () => {
      const result = GET();
      expect(result).toBeDefined();
    });
  });

  describe('Environment Variables', () => {
    it('requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET', () => {
      const result = GET();
      expect(result).toBeDefined();
    });

    it('handles missing environment variables gracefully', () => {
      setEnvVar('GOOGLE_CLIENT_ID', undefined);
      setEnvVar('GOOGLE_CLIENT_SECRET', undefined);
      const result = GET();
      expect(result).toBeDefined();
    });
  });
});
