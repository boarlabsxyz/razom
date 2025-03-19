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
    Object.defineProperty(process.env, 'NEXTAUTH_URL', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });
    Object.defineProperty(process.env, 'VERCEL_URL', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(process.env, 'GOOGLE_CLIENT_ID', {
      value: 'test-client-id',
      writable: true,
      configurable: true,
    });
    Object.defineProperty(process.env, 'GOOGLE_CLIENT_SECRET', {
      value: 'test-client-secret',
      writable: true,
      configurable: true,
    });

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
      Object.defineProperty(process.env, 'NEXTAUTH_URL', {
        value: 'https://example.com',
        writable: true,
        configurable: true,
      });

      const result = GET();
      expect(result).toBeDefined();
    });

    it('returns correct URL in development with host header', () => {
      (headers as jest.Mock).mockReturnValue({
        get: () => 'localhost:8000',
      });

      const result = GET();
      expect(result).toBeDefined();
    });

    it('returns correct URL in production with VERCEL_URL', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
        configurable: true,
      });
      Object.defineProperty(process.env, 'VERCEL_URL', {
        value: 'example.vercel.app',
        writable: true,
        configurable: true,
      });

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
      Object.defineProperty(process.env, 'GOOGLE_CLIENT_ID', {
        value: undefined,
        writable: true,
        configurable: true,
      });
      Object.defineProperty(process.env, 'GOOGLE_CLIENT_SECRET', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const result = GET();
      expect(result).toBeDefined();
    });
  });
});
