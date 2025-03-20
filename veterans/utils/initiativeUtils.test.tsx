import { processInitiatives } from './initiativeUtils';
import { Initiative, Paragraph, Child } from 'types';

describe('processInitiatives', () => {
  it('should return an empty array if no data is provided', () => {
    expect(processInitiatives()).toEqual([]);
  });

  it('should return an empty array if initiatives is empty', () => {
    expect(processInitiatives({ initiatives: [] })).toEqual([]);
  });

  it('should correctly process initiatives', () => {
    const mockInitiatives: Initiative[] = [
      {
        id: '1',
        title: 'Initiative 1',
        description: {
          document: [
            {
              children: [{ text: 'First paragraph.' } as Child],
            } as Paragraph,
            {
              children: [{ text: 'Second paragraph.' } as Child],
            } as Paragraph,
          ],
        },
      },
    ];

    const result = processInitiatives({ initiatives: mockInitiatives });

    expect(result).toEqual([
      {
        id: '1',
        title: 'Initiative 1',
        description: 'First paragraph.\nSecond paragraph.',
      },
    ]);
  });

  it('should return null description if document is missing', () => {
    const mockInitiatives: Initiative[] = [
      {
        id: '2',
        title: 'Initiative without description',
        description: undefined,
      },
    ];

    const result = processInitiatives({ initiatives: mockInitiatives });

    expect(result).toEqual([
      {
        id: '2',
        title: 'Initiative without description',
        description: null,
      },
    ]);
  });
});
