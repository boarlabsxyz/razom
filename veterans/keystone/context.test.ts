import { getKeystoneContext } from './context';
import keystoneConfig from '../keystone';

jest.mock('@keystone-6/core/context', () => ({
  getContext: jest.fn(() => ({ mockContext: true })),
}));

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({ mockPrisma: true })),
  };
});

describe('getKeystoneContext', () => {
  it('should return the keystone context', async () => {
    const { getContext } = await import('@keystone-6/core/context');
    const context = await getKeystoneContext();
    const mockPrisma = { mockPrisma: true };

    expect(getContext).toHaveBeenCalledWith(keystoneConfig, mockPrisma);
    expect(context).toEqual({ mockContext: true });
  });

  it('should return the cached context on second call', async () => {
    const context1 = await getKeystoneContext();
    const context2 = await getKeystoneContext();
    expect(context1).toBe(context2);
  });
});
