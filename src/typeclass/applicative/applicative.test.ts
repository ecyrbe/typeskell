import { describe, it, expect, expectTypeOf } from 'vitest';
import type { NonEmptyArray } from '@data/non-empty-array';
import * as A from '@data/array';
import { pipe } from '../../pipe';

describe('Applicative', () => {
  it('should product many', () => {
    const result = pipe(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      A.productMany([1, 2, 3]),
    );
    expectTypeOf(result).toEqualTypeOf<NonEmptyArray<number>[]>();
    expect(result).toEqual([
      [1, 1, 4],
      [1, 1, 5],
      [1, 1, 6],
      [1, 2, 4],
      [1, 2, 5],
      [1, 2, 6],
      [1, 3, 4],
      [1, 3, 5],
      [1, 3, 6],
      [2, 1, 4],
      [2, 1, 5],
      [2, 1, 6],
      [2, 2, 4],
      [2, 2, 5],
      [2, 2, 6],
      [2, 3, 4],
      [2, 3, 5],
      [2, 3, 6],
      [3, 1, 4],
      [3, 1, 5],
      [3, 1, 6],
      [3, 2, 4],
      [3, 2, 5],
      [3, 2, 6],
      [3, 3, 4],
      [3, 3, 5],
      [3, 3, 6],
    ]);
  });
});
