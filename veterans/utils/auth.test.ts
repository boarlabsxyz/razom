import { setupNextAuthUrl } from './auth';

describe('auth utils', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    jest.resetModules();

    originalEnv = process.env;

    const env = { ...originalEnv };
    Object.defineProperty(process, 'env', {
      value: env,
      writable: true,
      configurable: true,
    });

    delete process.env.NEXTAUTH_URL;
    delete process.env.VERCEL_URL;
    delete process.env.VERCEL;
    delete process.env.VERCEL_ENV;

    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(process, 'env', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });
  });

  describe('setupNextAuthUrl', () => {
    it('should not modify NEXTAUTH_URL if it is already set', () => {
      process.env.NEXTAUTH_URL = 'https://example.com';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('https://example.com');
    });

    it('should use VERCEL_URL in Vercel environment (VERCEL=1)', () => {
      process.env.VERCEL = '1';
      process.env.VERCEL_URL = 'example.vercel.app';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('https://example.vercel.app');
    });

    it('should use VERCEL_URL in Vercel environment (VERCEL_ENV set)', () => {
      process.env.VERCEL_ENV = 'production';
      process.env.VERCEL_URL = 'example.vercel.app';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('https://example.vercel.app');
    });

    it('should fall back to localhost:8000 when VERCEL_URL is empty in Vercel environment', () => {
      process.env.VERCEL = '1';
      process.env.VERCEL_URL = '';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('http://localhost:8000');
    });

    it('should fall back to localhost:8000 when not in Vercel environment', () => {
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('http://localhost:8000');
    });

    it('should not modify NEXTAUTH_URL in browser environment', () => {
      Object.defineProperty(global, 'window', {
        value: {},
        writable: true,
        configurable: true,
      });
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBeUndefined();
    });
  });
});
