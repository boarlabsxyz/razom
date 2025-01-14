/* eslint-disable @typescript-eslint/no-explicit-any */
import { seedDemoData } from './seedDemoData';
import demoInitiatives from '../data/demoInitiatives';

describe('seedDemoData', () => {
  const mockContext = {
    db: {
      Post: {
        count: jest.fn(),
        createOne: jest.fn(),
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not create posts if there are existing posts', async () => {
    mockContext.db.Post.count.mockResolvedValue(1);

    await seedDemoData(mockContext as any);

    expect(mockContext.db.Post.count).toHaveBeenCalledTimes(1);
    expect(mockContext.db.Post.createOne).not.toHaveBeenCalled();
  });

  it('should create posts for each initiative if there are no existing posts', async () => {
    mockContext.db.Post.count.mockResolvedValue(0);

    await seedDemoData(mockContext as any);

    expect(mockContext.db.Post.count).toHaveBeenCalledTimes(1);
    expect(mockContext.db.Post.createOne).toHaveBeenCalledTimes(
      demoInitiatives.length,
    );

    demoInitiatives.forEach((initiative, index) => {
      expect(mockContext.db.Post.createOne).toHaveBeenNthCalledWith(index + 1, {
        data: initiative,
      });
    });
  });
});
