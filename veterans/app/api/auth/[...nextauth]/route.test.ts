import '@testing-library/jest-dom';
import { authConfig } from '../auth.config';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import NextAuth from 'next-auth';

// Mock NextAuth handlers
const mockGetHandler = jest.fn();
const mockPostHandler = jest.fn();

// Mock next-auth
jest.mock('next-auth', () => {
  const mockNextAuth = jest.fn(() => ({
    GET: mockGetHandler,
    POST: mockPostHandler,
  }));

  return {
    __esModule: true,
    default: mockNextAuth,
  };
});

// Mock route module
jest.mock('./route', () => {
  return {
    __esModule: true,
    GET: mockGetHandler,
    POST: mockPostHandler,
    dynamic: 'force-dynamic',
  };
});

const mockNextAuth = jest.mocked(NextAuth);

describe('NextAuth Route Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize NextAuth with the correct config', () => {
    const handlers = NextAuth(authConfig);
    expect(mockNextAuth).toHaveBeenCalledWith(authConfig);
    expect(handlers).toHaveProperty('GET');
    expect(handlers).toHaveProperty('POST');
  });

  it('should handle GET requests', async () => {
    const request = new Request(
      'http://localhost:3000/api/auth/callback/google',
    );
    const { GET } = await import('./route');
    await GET(request);

    expect(mockGetHandler).toHaveBeenCalledWith(request);
  });

  it('should handle POST requests', async () => {
    const request = new Request(
      'http://localhost:3000/api/auth/callback/google',
      { method: 'POST' },
    );
    const { POST } = await import('./route');
    await POST(request);

    expect(mockPostHandler).toHaveBeenCalledWith(request);
  });

  it('should be configured as dynamic', async () => {
    const { dynamic } = await import('./route');
    expect(dynamic).toBe('force-dynamic');
  });
});
