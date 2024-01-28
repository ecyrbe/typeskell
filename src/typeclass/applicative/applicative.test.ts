import { describe, it, expect, expectTypeOf } from 'vitest';
import * as A from '@data/array';
import { pipe } from '../../pipe';

describe('Applicative', () => {
  it('should liftA2', () => {
    const result = pipe(
      [4, 5, 6],
      pipe(
        [1, 2, 3],
        A.liftA2((a, b) => [a, b]),
      ),
    );
    expectTypeOf(result).toEqualTypeOf<number[][]>();
    expect(result).toEqual([
      [1, 4],
      [1, 5],
      [1, 6],
      [2, 4],
      [2, 5],
      [2, 6],
      [3, 4],
      [3, 5],
      [3, 6],
    ]);
  });

  it('should zipLeft', () => {
    const result = pipe(
      [4, 5, 6],
      pipe(
        [1, 2, 3],
        A.liftA2((a, b) => a),
      ),
    );
    expectTypeOf(result).toEqualTypeOf<number[]>();
    expect(result).toEqual([1, 1, 1, 2, 2, 2, 3, 3, 3]);
  });

  it('should zipRight', () => {
    const result = pipe(
      [4, 5, 6],
      pipe(
        [1, 2, 3],
        A.liftA2((a, b) => b),
      ),
    );
    expectTypeOf(result).toEqualTypeOf<number[]>();
    expect(result).toEqual([4, 5, 6, 4, 5, 6, 4, 5, 6]);
  });

  it('should product many', () => {
    const result = pipe(
      [
        [1, 2, 3],
        [4, 5, 6],
      ],
      A.productMany([1, 2, 3]),
    );
    expectTypeOf(result).toEqualTypeOf<number[][]>();
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
