import { KeystoneContext } from '@keystone-6/core/types';
import { updateInitiativesCount } from './updateInitiativesCount';
import { DEFAULT_REGION_NAME } from 'constants/ui';

describe('updateInitiativesCount', () => {
  let mockContext: Partial<KeystoneContext>;
  let consoleSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    mockContext = {
      db: {
        Region: {
          findMany: jest.fn(),
          updateOne: jest.fn(),
          findOne: jest.fn(),
          count: jest.fn(),
          updateMany: jest.fn(),
          createOne: jest.fn(),
          createMany: jest.fn(),
          deleteOne: jest.fn(),
          deleteMany: jest.fn(),
        },
        Initiative: {
          count: jest.fn(),
          findMany: jest.fn(),
          findOne: jest.fn(),
          updateOne: jest.fn(),
          updateMany: jest.fn(),
          createOne: jest.fn(),
          createMany: jest.fn(),
          deleteOne: jest.fn(),
          deleteMany: jest.fn(),
        },
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should update count for "Всі області"(DEFAULT_REGION_NAME) region', async () => {
    const mockAllRegion = { id: '1', name: DEFAULT_REGION_NAME };
    (mockContext.db!.Region.findMany as jest.Mock).mockResolvedValue([
      mockAllRegion,
    ]);
    (mockContext.db!.Initiative.count as jest.Mock).mockResolvedValue(5);

    await updateInitiativesCount(mockContext as KeystoneContext, null);

    expect(mockContext.db!.Region.updateOne).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { numOfInitiatives: 5 },
    });
  });

  it('should update count for specific region', async () => {
    const regionId = '2';
    const mockAllRegion = { id: '1', name: DEFAULT_REGION_NAME };
    (mockContext.db!.Region.findMany as jest.Mock).mockResolvedValue([
      mockAllRegion,
    ]);
    (mockContext.db!.Initiative.count as jest.Mock).mockResolvedValue(3);

    await updateInitiativesCount(mockContext as KeystoneContext, regionId);

    expect(mockContext.db!.Initiative.count).toHaveBeenCalledWith({
      where: {
        region: { id: { equals: regionId } },
        archived: { equals: false },
        status: { equals: 'approved' },
      },
    });
    expect(mockContext.db!.Region.updateOne).toHaveBeenCalledWith({
      where: { id: regionId },
      data: { numOfInitiatives: 3 },
    });
  });

  it('should update count for all other regions', async () => {
    const mockRegions = [
      { id: '1', name: DEFAULT_REGION_NAME },
      { id: '2', name: 'Київська' },
      { id: '3', name: 'Львівська' },
    ];
    (mockContext.db!.Region.findMany as jest.Mock)
      .mockResolvedValueOnce([mockRegions[0]])
      .mockResolvedValueOnce([mockRegions[1], mockRegions[2]]);
    (mockContext.db!.Initiative.count as jest.Mock)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(3);

    await updateInitiativesCount(mockContext as KeystoneContext, null);

    expect(mockContext.db!.Region.updateOne).toHaveBeenCalledTimes(3);
    expect(mockContext.db!.Region.updateOne).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { numOfInitiatives: 5 },
    });
    expect(mockContext.db!.Region.updateOne).toHaveBeenCalledWith({
      where: { id: '2' },
      data: { numOfInitiatives: 2 },
    });
    expect(mockContext.db!.Region.updateOne).toHaveBeenCalledWith({
      where: { id: '3' },
      data: { numOfInitiatives: 3 },
    });
  });

  it('should handle missing "Всі області"(DEFAULT_REGION_NAME) region gracefully', async () => {
    (mockContext.db!.Region.findMany as jest.Mock).mockResolvedValue([]);

    await updateInitiativesCount(mockContext as KeystoneContext, null);

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Region with name DEFAULT_REGION_NAME not found.',
      ),
    );
  });

  it('should handle errors gracefully', async () => {
    const error = new Error('Database error');
    (mockContext.db!.Region.findMany as jest.Mock).mockRejectedValue(error);

    await updateInitiativesCount(mockContext as KeystoneContext, null);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Помилка при оновленні кількості ініціатив:'),
      error,
    );
  });

  it('should handle missing context gracefully', async () => {
    await updateInitiativesCount(null as unknown as KeystoneContext, null);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Keystone context is not initialized.'),
    );
  });
});
