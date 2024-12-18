import getImageQuality from './getImageQuality';

describe('getImageQuality', () => {
  it('should return 100 for local paths', () => {
    const localPath = '/images/sample.jpg';
    const quality = getImageQuality(localPath);
    expect(quality).toBe(100);
  });

  it('should return 75 for external URLs', () => {
    const externalUrl = 'https://example.com/images/sample.jpg';
    const quality = getImageQuality(externalUrl);
    expect(quality).toBe(75);
  });
});
