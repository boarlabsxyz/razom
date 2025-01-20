/* eslint-disable @typescript-eslint/no-explicit-any */
import { seedDemoData } from './seedDemoData';
import demoInitiatives from '../data/demoInitiatives';

describe('seedDemoData', () => {
  const mockTransaction = jest.fn(async (callback: any) => {
    await callback(mockPrisma);
  });

  const mockPrisma = {
    post: {
      create: jest.fn(),
    },
  };

  const mockContext = {
    db: {
      Post: {
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

  it('should not create posts if there are existing posts', async () => {
    mockContext.db.Post.count.mockResolvedValue(1);

    await seedDemoData(mockContext as any);

    expect(mockContext.db.Post.count).toHaveBeenCalledTimes(1);
    expect(mockTransaction).not.toHaveBeenCalled();
    expect(mockPrisma.post.create).not.toHaveBeenCalled();
  });

  it('should create posts for each initiative if there are no existing posts', async () => {
    mockContext.db.Post.count.mockResolvedValue(0);

    await seedDemoData(mockContext as any);

    expect(mockContext.db.Post.count).toHaveBeenCalledTimes(1);
    expect(mockTransaction).toHaveBeenCalledTimes(1);
    expect(mockPrisma.post.create).toHaveBeenCalledTimes(
      demoInitiatives.length,
    );

    demoInitiatives.forEach((initiative, index) => {
      expect(mockPrisma.post.create).toHaveBeenNthCalledWith(index + 1, {
        data: initiative,
      });
    });
  });
});
