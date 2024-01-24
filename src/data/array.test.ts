import { describe, it, expect, expectTypeOf } from 'vitest';
import * as A from '@data/array';
import * as O from '@data/option';
import { pipe } from '../pipe';
import { functorLaws } from '@typeclass/functor/functor.laws';
import * as fc from 'fast-check';

describe('Array', () => {
  describe('traverse', () => {
    it('should traverse with option some', () => {
      const result = pipe(
        [1, 2, 3],
        A.traverse(O.Applicative)(a => (a > 0 ? O.some(a) : O.none())),
      );
      expectTypeOf(result).toEqualTypeOf<O.Option<number[]>>();
      expect(result).toEqual(O.some([1, 2, 3]));
    });
    it('should traverse with option none', () => {
      const result = pipe(
        [1, 2, 3],
        A.traverse(O.Applicative)(a => (a > 1 ? O.some(a) : O.none())),
      );
      expectTypeOf(result).toEqualTypeOf<O.Option<number[]>>();
      expect(result).toEqual(O.none());
    });
  });
  describe('sequence', () => {
    it('should sequence with option some', () => {
      const result = pipe([O.some(1), O.some(2), O.some(3)], A.sequence(O.Applicative));
      expectTypeOf(result).toEqualTypeOf<O.Option<number[]>>();
      expect(result).toEqual(O.some([1, 2, 3]));
    });
    it('should sequence with option none', () => {
      const result = pipe([O.some(1), O.none(), O.some(3)], A.sequence(O.Applicative));
      expectTypeOf(result).toEqualTypeOf<O.Option<number[]>>();
      expect(result).toEqual(O.none());
    });
  });
  describe('semialign', () => {
    it('should zithWith', () => {
      const result = pipe(
        [1, 2, 3],
        pipe(
          [4, 5, 6],
          A.zipWith((a, b) => a + b),
        ),
      );
      expectTypeOf(result).toEqualTypeOf<number[]>();
      expect(result).toEqual([5, 7, 9]);
    });
    it('should zip', () => {
      const result = pipe([4, 5, 6], A.zip([1, 2, 3]));
      expectTypeOf(result).toEqualTypeOf<[number, number][]>();
      expect(result).toEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ]);
    });
  });

  describe('functor', () => {
    it('should obey functor identity law', () => {
      const law = functorLaws(A.Functor).identity;
      fc.assert(
        fc.property(fc.array(fc.anything()), a => {
          expect(law.left(a)).toEqual(law.right(a));
        }),
      );
    });
    it('should obey functor composition law', () => {
      const law = functorLaws(A.Functor).composition;
      fc.assert(
        fc.property(fc.array(fc.anything()), a => {
          const f = <A>(x: A) => ({ x });
          const g = <A>(x: { x: A }) => ({ y: x.x });
          expect(law.left(f, g)(a)).toEqual(law.right(f, g)(a));
        }),
      );
    });
  });
});
