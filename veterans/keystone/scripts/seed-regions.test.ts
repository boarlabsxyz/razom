import { main, prisma } from './seed-regions';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      region: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({
          id: '1',
          name: 'Test Region',
          numOfInitiatives: 0,
          isDefault: false,
          order: 1,
        }),
        findMany: jest.fn().mockResolvedValue([]),
      },
      $disconnect: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('seed-regions', () => {
  let consoleSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let processExitSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    processExitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('виводить повідомлення про успішне завершення', async () => {
    await main();
    expect(consoleSpy).toHaveBeenCalledWith('✅ Регіони успішно створені');
  });

  it('видаляє існуючі регіони перед створенням нових', async () => {
    await main();
    expect(prisma.region.deleteMany).toHaveBeenCalled();
  });

  it('створює нові регіони', async () => {
    await main();
    expect(prisma.region.create).toHaveBeenCalledTimes(26);
  });

  it("від'єднується від бази даних після завершення", async () => {
    await main();
    expect(prisma.$disconnect).toHaveBeenCalled();
  });

  it('коректно обробляє помилки', async () => {
    const mockError = new Error('Database error');
    jest.spyOn(prisma.region, 'deleteMany').mockRejectedValueOnce(mockError);

    await main();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Помилка при створенні регіонів:',
      mockError,
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
