const mockCreate = jest.fn().mockResolvedValue({
  id: '1',
  name: 'Test Region',
  numOfInitiatives: 0,
  isDefault: false,
  order: 1,
});

const mockDeleteMany = jest.fn().mockResolvedValue({});
const mockFindMany = jest.fn().mockResolvedValue([]);
const mockDisconnect = jest.fn();

const mockPrismaClient = {
  region: {
    create: mockCreate,
    deleteMany: mockDeleteMany,
    findMany: mockFindMany,
  },
  $disconnect: mockDisconnect,
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  return undefined as never;
});

let consoleErrorSpy: jest.SpyInstance;
let consoleSpy: jest.SpyInstance;

beforeEach(() => {
  consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.clearAllMocks();
});

afterEach(() => {
  consoleSpy.mockRestore();
  consoleErrorSpy.mockRestore();
  jest.clearAllMocks();
});

import { main } from './seed-regions';

describe('seed-regions', () => {
  it('should create regions when none exist', async () => {
    await main();
    expect(mockCreate).toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
  });

  it('should handle database errors gracefully', async () => {
    mockDeleteMany.mockRejectedValueOnce(new Error('Database error'));
    await main();
    expect(mockDisconnect).toHaveBeenCalled();
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Помилка при створенні регіонів:',
      expect.any(Error),
    );
  });
});
