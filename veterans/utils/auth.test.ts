import { setupNextAuthUrl } from './auth';
import { headers } from 'next/headers';
import { ParsedUrlQuery } from 'querystring';

interface NextData {
  props: Record<string, unknown>;
  page: string;
  query: ParsedUrlQuery;
  buildId: string;
}

interface CustomWindow extends Window {
  __NEXT_DATA__: NextData;
}

jest.mock('next/headers', () => ({
  headers: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

describe('auth utils', () => {
  let mockHeadersGet: jest.Mock;
  let mockHostValue: string | undefined;
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Store original process.env
    originalEnv = process.env;

    // Create a new process.env object
    const env = { ...originalEnv };
    Object.defineProperty(process, 'env', {
      value: env,
      writable: true,
    });

    // Reset environment variables
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
    });
    process.env.VERCEL_URL = undefined;
    process.env.NEXTAUTH_URL = undefined;

    // Reset headers mock
    mockHostValue = undefined;
    mockHeadersGet = jest.fn((key: string) => {
      if (key === 'host') {
        return mockHostValue;
      }
      return undefined;
    });
    (headers as jest.Mock).mockReturnValue({
      get: mockHeadersGet,
    });

    // Ensure window is undefined for server-side tests
    Object.defineProperty(global, 'window', {
      value: undefined,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original process.env
    Object.defineProperty(process, 'env', {
      value: originalEnv,
      writable: true,
    });
  });

  describe('setupNextAuthUrl', () => {
    it('should set NEXTAUTH_URL from host header in development', () => {
      mockHostValue = 'example.com';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('http://example.com');
    });

    it('should set NEXTAUTH_URL from host header in production', () => {
      Object.defineProperty(process.env, 'NODE_ENV', {
        value: 'production',
        writable: true,
      });
      mockHostValue = 'example.com';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('https://example.com');
    });

    it('should use VERCEL_URL when host header is not present', () => {
      mockHostValue = undefined;
      process.env.VERCEL_URL = 'vercel-app.vercel.app';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('https://vercel-app.vercel.app');
    });

    it('should use localhost:8000 as fallback', () => {
      mockHostValue = undefined;
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('http://localhost:8000');
    });

    it('should not modify NEXTAUTH_URL if it is already set', () => {
      process.env.NEXTAUTH_URL = 'http://existing-url.com';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('http://existing-url.com');
    });

    it('should not modify NEXTAUTH_URL in browser environment', () => {
      Object.defineProperty(global, 'window', {
        value: {
          document: {},
          name: '',
          __NEXT_DATA__: {
            props: {},
            page: '/',
            query: {},
            buildId: 'test',
          },
        } as CustomWindow,
        writable: true,
      });
      process.env.NEXTAUTH_URL = 'http://existing-url.com';
      setupNextAuthUrl();
      expect(process.env.NEXTAUTH_URL).toBe('http://existing-url.com');
    });
  });
});
