import { main, prisma } from './seed-initiative';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      category: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([
          { id: 'cat1', title: 'Управління, відділи з ветеранської політики' },
          { id: 'cat2', title: 'Фахівець з супроводу' },
          { id: 'cat3', title: 'Карʼєрне консультування' },
          { id: 'cat4', title: 'Можливості працевлаштування' },
          { id: 'cat5', title: 'Ветеранські програми' },
          { id: 'cat6', title: 'Освіта та бізнес' },
          { id: 'cat7', title: 'Гранти' },
          { id: 'cat8', title: 'Юридичне консультування' },
          { id: 'cat9', title: 'Хаби' },
          { id: 'cat10', title: 'Можливості розвитку та дозвілля' },
        ]),
      },
      source: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({}),
        findMany: jest.fn().mockResolvedValue([
          { id: 'src1', title: 'Державна' },
          { id: 'src2', title: 'Приватна' },
          { id: 'src3', title: 'Міжнародна' },
        ]),
      },
      region: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'reg1', name: 'Київська' },
          { id: 'reg2', name: 'Львівська' },
          { id: 'reg3', name: 'Волинська' },
          { id: 'reg4', name: 'Дніпропетровська' },
          { id: 'reg5', name: 'Донецька' },
          { id: 'reg6', name: 'Житомирська' },
          { id: 'reg7', name: 'Закарпатська' },
          { id: 'reg8', name: 'Запорізька' },
          { id: 'reg9', name: 'Івано-Франківська' },
          { id: 'reg10', name: 'Кіровоградська' },
          { id: 'reg11', name: 'Миколаївська' },
          { id: 'reg12', name: 'Чернівецька' },
          { id: 'reg13', name: 'Хмельницька' },
          { id: 'reg14', name: 'Полтавська' },
          { id: 'reg15', name: 'Тернопільська' },
          { id: 'reg16', name: 'Рівненська' },
        ]),
      },
      initiative: {
        deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        create: jest.fn().mockResolvedValue({}),
      },
      $disconnect: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('seed-initiative', () => {
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

  it('displays success messages', async () => {
    await main();
    const calls = consoleSpy.mock.calls.flat();
    expect(calls).toContain('✅ Категорії успішно створені');
    expect(calls).toContain('✅ Джерела успішно створені');
    expect(calls).toContain('✅ Ініціативи успішно створені');
  });

  it('deletes existing categories before creating new ones', async () => {
    await main();
    expect(prisma.category.deleteMany).toHaveBeenCalled();
  });

  it('deletes existing sources before creating new ones', async () => {
    await main();
    expect(prisma.source.deleteMany).toHaveBeenCalled();
  });

  it('deletes existing initiatives before creating new ones', async () => {
    await main();
    expect(prisma.initiative.deleteMany).toHaveBeenCalled();
  });

  it('creates new categories', async () => {
    await main();
    expect(prisma.category.create).toHaveBeenCalledTimes(10);
  });

  it('creates new sources', async () => {
    await main();
    expect(prisma.source.create).toHaveBeenCalledTimes(3);
  });

  it('queries categories, sources and regions before creating initiatives', async () => {
    await main();
    expect(prisma.category.findMany).toHaveBeenCalled();
    expect(prisma.source.findMany).toHaveBeenCalled();
    expect(prisma.region.findMany).toHaveBeenCalled();
  });

  it('creates initiatives based on data', async () => {
    await main();
    expect(prisma.initiative.create).toHaveBeenCalledTimes(30);
  });

  it('disconnects from the database after completion', async () => {
    await main();
    expect(prisma.$disconnect).toHaveBeenCalled();
  });

  it('handles errors correctly', async () => {
    const mockError = new Error(
      'Не знайдено необхідні дані для ініціативи: Центр зайнятості ветеранів',
    );
    jest.spyOn(prisma.category, 'findMany').mockRejectedValueOnce(mockError);

    await main();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '❌ Помилка при заповненні бази даних:',
      mockError,
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
