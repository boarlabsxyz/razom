import demoInitiatives from './demoInitiatives';

describe('Demo Initiatives', () => {
  it('should be an array of initiatives', () => {
    expect(Array.isArray(demoInitiatives)).toBe(true);
  });

  it('should have valid structure for each initiative', () => {
    demoInitiatives.forEach((initiative) => {
      expect(typeof initiative.title).toBe('string');
      expect(Array.isArray(initiative.content)).toBe(true);

      initiative.content.forEach((contentItem) => {
        expect(contentItem.type).toBe('paragraph');
        expect(Array.isArray(contentItem.children)).toBe(true);

        contentItem.children.forEach((child) => {
          expect(typeof child.text).toBe('string');
        });
      });
    });
  });

  it('should have unique titles', () => {
    const titles = demoInitiatives.map((initiative) => initiative.title);
    const uniqueTitles = new Set(titles);
    expect(uniqueTitles.size).toBe(titles.length);
  });

  it('should contain non-empty text in each initiative', () => {
    demoInitiatives.forEach((initiative) => {
      initiative.content.forEach((contentItem) => {
        contentItem.children.forEach((child) => {
          expect(child.text).toBeTruthy();
        });
      });
    });
  });
});
