/* eslint-disable @typescript-eslint/no-explicit-any */
import * as PrismaModule from '.prisma/client';
import config from '../keystone';

jest.mock('@keystone-6/core/context', () => ({
  getContext: jest.fn(),
}));

jest.mock('.prisma/client', () => ({}));

jest.mock('../keystone', () => ({}));

describe('keystoneContext', () => {
  let originalKeystoneContext: any;

  beforeEach(() => {
    originalKeystoneContext = (globalThis as any).keystoneContext;
    delete (globalThis as any).keystoneContext;

    jest.resetModules();

    jest.mock('@keystone-6/core/context', () => ({
      getContext: jest.fn(),
    }));
  });

  afterEach(() => {
    (globalThis as any).keystoneContext = originalKeystoneContext;
    delete (globalThis as any).keystoneContext;
    jest.clearAllMocks();
  });

  it('should initialize a new keystoneContext when not present in globalThis', async () => {
    const mockGetContext = jest.fn(() => ({ prisma: 'mocked-prisma-client' }));
    const { getContext } = await import('@keystone-6/core/context');
    (getContext as jest.Mock).mockImplementation(mockGetContext);

    const { keystoneContext } = await import('./context');

    expect(keystoneContext).toEqual({ prisma: 'mocked-prisma-client' });
    expect(mockGetContext).toHaveBeenCalledWith(config, PrismaModule);
  });

  it('should use existing keystoneContext from globalThis if available', async () => {
    const mockContext = { prisma: 'existing-prisma-client' };
    (globalThis as any).keystoneContext = mockContext;

    const { keystoneContext } = await import('./context');
    const { getContext } = await import('@keystone-6/core/context');

    expect(keystoneContext).toBe(mockContext);
    expect(getContext).not.toHaveBeenCalled();
  });

  it('should log and throw an error if initialization fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockGetContext = jest.fn(() => {
      throw new Error('Mocked initialization error');
    });

    jest.mock('@keystone-6/core/context', () => ({
      getContext: mockGetContext,
    }));

    jest.resetModules();

    await expect(async () => {
      const module = await import('./context');
      return module.keystoneContext;
    }).rejects.toThrow('Mocked initialization error');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to initialize Keystone context:',
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore();
  });
});
