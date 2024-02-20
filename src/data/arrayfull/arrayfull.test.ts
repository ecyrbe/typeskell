import { pipe } from '@utils/pipe';
import { describe, expect, it } from 'vitest';
import { duplicate, isArrayFull, map, extract, extend } from './arrayfull';
import type { ArrayFull } from './arrayfull.types';

describe('NonEmptyArray', () => {
  describe('comonad', () => {
    it('should extract', () => {
      const nonEmptyArray = [1, 2, 3];
      if (isArrayFull(nonEmptyArray)) {
        const test = pipe(nonEmptyArray, extract);
        expect(test).toEqual(1);
      }
    });

    it('should extend', () => {
      const nonEmptyArray = [1, 2, 3];
      if (isArrayFull(nonEmptyArray)) {
        const test = pipe(
          nonEmptyArray,
          extend(x => x.length),
        );
        expect(test).toEqual([3, 2, 1]);
      }
    });

    it('should obay comonad left identity law', () => {
      // law : extract . extend f = f
      const nonEmptyArray = [1, 2, 3];
      if (isArrayFull(nonEmptyArray)) {
        const f = (x: number[]) => x.length;
        const test1 = pipe(nonEmptyArray, extend(f), extract);
        const test2 = pipe(nonEmptyArray, f);
        expect(test1).toEqual(test2);
      }
    });

    it('should obay comonad right identity law', () => {
      // law : extend extract = id
      const nonEmptyArray = [1, 2, 3];
      if (isArrayFull(nonEmptyArray)) {
        const test1 = pipe(nonEmptyArray, extend(extract));
        expect(test1).toEqual(nonEmptyArray);
      }
    });

    it('should obay comonad associativity law', () => {
      // law : extend f . extend g = extend (f . extend g)
      const nonEmptyArray = [1, 2, 3];
      if (isArrayFull(nonEmptyArray)) {
        const f = (x: ArrayFull<number>) => x.reduce((a, b) => a + b, 0);
        const g = (x: ArrayFull<number>) => x.reduce((a, b) => a * b, 1);
        const test1 = pipe(nonEmptyArray, extend(g), extend(f));
        const test2 = pipe(
          nonEmptyArray,
          extend(x => pipe(x, extend(g), f)),
        );
        expect(test1).toEqual(test2);
      }
    });

    it('should duplicate', () => {
      const nonEmptyArray = [1, 2, 3];
      if (isArrayFull(nonEmptyArray)) {
        const test1 = pipe(nonEmptyArray, duplicate);
        const test2 = pipe(
          nonEmptyArray,
          extend(x => x),
        );
        expect(test1).toEqual([[1, 2, 3], [2, 3], [3]]);
        expect(test1).toEqual(test2);
      }
    });

    it('should duplicate according to laws', () => {
      // law : map (map f) . duplicate = duplicate . map f
      const nonEmptyArray = [1, 2, 3];
      if (isArrayFull(nonEmptyArray)) {
        const f = (x: number) => x + 1;
        const test1 = pipe(nonEmptyArray, duplicate, map(map(f)));
        const test2 = pipe(nonEmptyArray, map(f), duplicate);
        expect(test1).toEqual(test2);
      }
    });
  });
});
