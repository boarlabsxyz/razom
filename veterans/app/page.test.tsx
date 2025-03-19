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

describe('Page Component', () => {
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

    global.window = undefined as unknown as Window & typeof globalThis;

    (headers as jest.Mock).mockReset();
  });

  afterEach(() => {
    process.env = originalEnv;

    global.window = originalWindow;
  });

  it('renders the HomePage component', () => {
    (headers as jest.Mock).mockReturnValue({
      get: () => 'localhost:8000',
    });

    render(<Page />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  it('sets NEXTAUTH_URL correctly in development environment', () => {
    (headers as jest.Mock).mockReturnValue({
      get: () => null,
    });
    Object.defineProperty(process.env, 'VERCEL_URL', {
      value: undefined,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });

    render(<Page />);

    Object.defineProperty(process.env, 'NEXTAUTH_URL', {
      value: 'http://localhost:8000',
      writable: true,
      configurable: true,
    });
    expect(process.env.NEXTAUTH_URL).toBe('http://localhost:8000');
  });

  it('sets NEXTAUTH_URL correctly in production environment with VERCEL_URL', () => {
    (headers as jest.Mock).mockReturnValue({
      get: () => null,
    });
    Object.defineProperty(process.env, 'VERCEL_URL', {
      value: 'example.vercel.app',
      writable: true,
      configurable: true,
    });
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'production',
      writable: true,
      configurable: true,
    });

    render(<Page />);

    Object.defineProperty(process.env, 'NEXTAUTH_URL', {
      value: 'https://example.vercel.app',
      writable: true,
      configurable: true,
    });
    expect(process.env.NEXTAUTH_URL).toBe('https://example.vercel.app');
  });

  it('sets NEXTAUTH_URL correctly using host header', () => {
    (headers as jest.Mock).mockReturnValue({
      get: () => 'example.com',
    });
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development',
      writable: true,
      configurable: true,
    });

    render(<Page />);

    Object.defineProperty(process.env, 'NEXTAUTH_URL', {
      value: 'http://example.com',
      writable: true,
      configurable: true,
    });
    expect(process.env.NEXTAUTH_URL).toBe('http://example.com');
  });

  it('has the correct exports', () => {
    expect(dynamic).toBe('force-dynamic');
    expect(revalidate).toBe(0);
  });
});
