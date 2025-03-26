import {
  processInitiatives,
  getDescription,
  processInitiative,
} from './initiativeUtils';
import type { Initiative } from '../keystone/models/Initiative';

describe('initiativeUtils', () => {
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
          name: 'Initiative 1',
          initiativeDescription: {
            document: [
              {
                type: 'paragraph',
                children: [{ text: 'First paragraph.' }],
              },
              {
                type: 'paragraph',
                children: [{ text: 'Second paragraph.' }],
              },
            ],
          },
          region: { name: 'Region 1' },
          category: { name: 'Category 1' },
          source: { name: 'Source 1' },
          status: 'Active',
        },
      ];

      const result = processInitiatives({ initiatives: mockInitiatives });

      expect(result).toEqual([
        {
          id: '1',
          title: 'Initiative 1',
          description: 'First paragraph.\nSecond paragraph.',
          region: 'Region 1',
          category: 'Category 1',
          source: 'Source 1',
          status: 'Active',
        },
      ]);
    });

    it('should handle missing optional fields', () => {
      const mockInitiatives: Initiative[] = [
        {
          id: '2',
          name: 'Initiative without optional fields',
          initiativeDescription: undefined,
          region: null,
          category: null,
          source: null,
          status: undefined,
        },
      ];

      const result = processInitiatives({ initiatives: mockInitiatives });

      expect(result).toEqual([
        {
          id: '2',
          title: 'Initiative without optional fields',
          description: '',
          region: '',
          category: '',
          source: '',
          status: '',
        },
      ]);
    });
  });

  describe('getDescription', () => {
    it('should return empty string if description is undefined', () => {
      expect(getDescription()).toBe('');
    });

    it('should return empty string if document is undefined', () => {
      expect(getDescription({})).toBe('');
    });

    it('should correctly format document text', () => {
      const description = {
        document: [
          {
            type: 'paragraph',
            children: [{ text: 'First paragraph.' }],
          },
          {
            type: 'paragraph',
            children: [{ text: 'Second paragraph.' }],
          },
        ],
      };

      expect(getDescription(description)).toBe(
        'First paragraph.\nSecond paragraph.',
      );
    });

    it('should handle empty text nodes', () => {
      const description = {
        document: [
          {
            type: 'paragraph',
            children: [{ text: '' }],
          },
        ],
      };

      expect(getDescription(description)).toBe('');
    });
  });

  describe('processInitiative', () => {
    it('should correctly process a single initiative', () => {
      const mockInitiative: Initiative = {
        id: '1',
        name: 'Test Initiative',
        initiativeDescription: {
          document: [
            {
              type: 'paragraph',
              children: [{ text: 'Test description.' }],
            },
          ],
        },
        region: { name: 'Test Region' },
        category: { name: 'Test Category' },
        source: { name: 'Test Source' },
        status: 'Active',
      };

      const result = processInitiative(mockInitiative);

      expect(result).toEqual({
        id: '1',
        title: 'Test Initiative',
        description: 'Test description.',
        region: 'Test Region',
        category: 'Test Category',
        source: 'Test Source',
        status: 'Active',
      });
    });

    it('should handle missing optional fields', () => {
      const mockInitiative: Initiative = {
        id: '1',
        name: 'Test Initiative',
        initiativeDescription: undefined,
        region: null,
        category: null,
        source: null,
        status: undefined,
      };

      const result = processInitiative(mockInitiative);

      expect(result).toEqual({
        id: '1',
        title: 'Test Initiative',
        description: '',
        region: '',
        category: '',
        source: '',
        status: '',
      });
    });
  });
});
