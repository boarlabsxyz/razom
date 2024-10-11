import { test, expect } from '@jest/globals';
import { Sample } from './sample';

test('Sample sum', () => {
    const sample = new Sample();
    expect(sample.sum(1, 2)).toBe(3);
} );
