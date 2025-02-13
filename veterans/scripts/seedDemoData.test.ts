/* eslint-disable @typescript-eslint/no-explicit-any */
import { seedDemoData } from './seedDemoData';
import demoInitiatives from '../data/demoInitiatives';

describe('seedDemoData', () => {
  const mockTransaction = jest.fn(async (callback: any) => {
    await callback(mockPrisma);
  });

  const mockPrisma = {
    initiative: {
      create: jest.fn(),
    },
  };

  const mockContext = {
    db: {
      Initiative: {
        count: jest.fn(),
      },
    },
    prisma: {
      $transaction: mockTransaction,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not create initiatives if there are existing initiatives', async () => {
    mockContext.db.Initiative.count.mockResolvedValue(1);

    await seedDemoData(mockContext as any);

    expect(mockContext.db.Initiative.count).toHaveBeenCalledTimes(1);
    expect(mockTransaction).not.toHaveBeenCalled();
    expect(mockPrisma.initiative.create).not.toHaveBeenCalled();
  });

  it('should create initiatives for each initiative if there are no existing initiatives', async () => {
    mockContext.db.Initiative.count.mockResolvedValue(0);

    await seedDemoData(mockContext as any);

    expect(mockContext.db.Initiative.count).toHaveBeenCalledTimes(1);
    expect(mockTransaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.initiative.create).toHaveBeenCalledTimes(
      demoInitiatives.length,
    );

    demoInitiatives.forEach((initiative, index) => {
      expect(mockPrisma.initiative.create).toHaveBeenNthCalledWith(index + 1, {
        data: initiative,
      });
    });
  });
});
