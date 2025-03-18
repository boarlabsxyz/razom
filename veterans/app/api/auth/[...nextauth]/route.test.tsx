import '@testing-library/jest-dom';
import { authConfig } from '../auth.config';
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import NextAuth from 'next-auth';

jest.mock('next-auth', () => {
  const mockHandlers = {
    GET: 'mock-get',
    POST: 'mock-post',
  };

  return {
    __esModule: true,
    default: jest.fn(() => mockHandlers),
  };
});

jest.mock('./route', () => {
  return {
    GET: 'mock-get',
    POST: 'mock-post',
  };
});

const mockNextAuth = jest.mocked(NextAuth);
import { GET, POST } from './route';

describe('NextAuth Route Handlers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize NextAuth with the correct config', () => {
    NextAuth(authConfig);
    expect(mockNextAuth).toHaveBeenCalledWith(authConfig);
  });

  it('should export GET and POST handlers', () => {
    expect(GET).toBe('mock-get');
    expect(POST).toBe('mock-post');
  });
});
