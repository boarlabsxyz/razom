import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Page, { dynamic, revalidate } from './page';
import { headers } from 'next/headers';

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

jest.mock('@comps/homePage/HomePage', () => {
  return function MockHomePage() {
    return <div data-testid="home-page">Home Page Content</div>;
  };
});

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

describe('Page Component', () => {
  const originalEnv = { ...process.env };
  const originalWindow = global.window;

  beforeEach(() => {
    process.env = { ...originalEnv };
    setEnvVar('NEXTAUTH_URL', undefined);
    setEnvVar('NODE_ENV', 'development');
    setEnvVar('VERCEL_URL', undefined);
    global.window = undefined as unknown as Window & typeof globalThis;
    (headers as jest.Mock).mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;
    global.window = originalWindow;
  });

  it('renders the HomePage component', () => {
    setupHeaders('localhost:8000');
    render(<Page />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('sets NEXTAUTH_URL correctly in development environment', () => {
    setupHeaders(null);
    setEnvVar('VERCEL_URL', undefined);
    setEnvVar('NODE_ENV', 'development');
    setEnvVar('NEXTAUTH_URL', 'http://localhost:8000');
    render(<Page />);
    expect(process.env.NEXTAUTH_URL).toBe('http://localhost:8000');
  });

  it('sets NEXTAUTH_URL correctly in production environment with VERCEL_URL', () => {
    setupHeaders(null);
    setEnvVar('VERCEL_URL', 'example.vercel.app');
    setEnvVar('NODE_ENV', 'production');
    setEnvVar('NEXTAUTH_URL', 'https://example.vercel.app');
    render(<Page />);
    expect(process.env.NEXTAUTH_URL).toBe('https://example.vercel.app');
  });

  it('sets NEXTAUTH_URL correctly using host header', () => {
    setupHeaders('example.com');
    setEnvVar('NODE_ENV', 'development');
    setEnvVar('NEXTAUTH_URL', 'http://example.com');
    render(<Page />);
    expect(process.env.NEXTAUTH_URL).toBe('http://example.com');
  });

  it('has the correct exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(revalidate).toBe(0);
  });
});
