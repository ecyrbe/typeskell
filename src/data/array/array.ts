import { Kind } from '@kinds';
import {
  Applicative,
  Filterable,
  Foldable,
  Functor,
  Monad,
  Of,
  OptionalTo,
  SemiAlign,
  SemiAlternative,
  To,
  Traversable,
  Zero,
} from './array.typeclass';
import * as O from '@data/option';
import { TArray } from './array.types';
import * as tfunctor from '@typeclass/functor';
import * as tTo from '@typeclass/to';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlign from '@typeclass/semialign';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tMonad from '@typeclass/monad';
import * as tFilterable from '@typeclass/filterable';
import * as tTraversable from '@typeclass/traversable';
import * as tGroups from '@typeclass/groups';
import { GroupProduct, GroupSum, MonoidMax, MonoidMin } from '@data/number';
import { pipe } from '@utils/pipe';

/**
 * produce an empty array of type a
 *
 * zero :: `() -> a[]`
 *
 * zero :: `<A>() => A[]`
 *
 * @returns `a[]`
 *
 * @example
 * ```ts
 * pipe(zero(), map(x => x + 1)) // []
 * ```
 */
export const zero = Zero.zero;

/**
 * of :: a -> a[]
 * @param a : a
 * @returns fa: a[]
 *
 * @example
 * ```ts
 * pipe(1, of) // [1]
 * ```
 */
export const of = Of.of;

/**
 * getOrElse :: (() -> b) -> a[] -> a | b
 *
 * getOrElse :: `<B>(f: () => B) => <A>(fa: A[]) => A | B`
 *
 * @param f : () -> b
 * @returns fa: a[] -> a | b
 *
 * @example
 * ```ts
 * pipe([1], getOrElse(() => 0)) // 1
 * pipe([], getOrElse(() => 0)) // 0
 * ```
 */
export const getOrElse = To.getOrElse;

/**
 * get :: a[] -> Option<a>
 *
 * get :: `<A>(fa: A[]) => Option<A>`
 *
 * @param fa: a[]
 * @returns Option<a>
 *
 * @example
 * ```ts
 * pipe([1], get) // some(1)
 * pipe([], get) // none
 * ```
 */
export const get = OptionalTo.get;

/**
 * getOr :: b -> a[] -> a | b
 *
 * getOr :: <B>(b: B) => <A>(fa: A[]) => A | B
 *
 * @param b : b
 * @returns fa: a[] -> a | b
 *
 * @example
 * ```ts
 * pipe([1], getOr(0)) // 1
 * pipe([], getOr(0)) // 0
 * ```
 */
export const getOr = tTo.getOr(To);

/**
 * map :: (a -> b) -> a[] -> b[]
 * @param f : a -> b
 * @returns fa: a[] -> b[]
 *
 * @example
 * ```ts
 * pipe([1,2,3], map(x => x + 1)) // [2,3,4]
 * ```
 */
export const map = Functor.map;

/**
 * flap :: a -> (a -> b)[] -> b[]
 * @param a : a
 * @returns fab: (a -> b)[] -> b[]
 *
 * @example
 * ```ts
 * pipe([x => x + 1, x => x*2], flap(2)) // [3, 4]
 * ```
 */
export const flap = tfunctor.flap(Functor);

/**
 * as :: b -> a[] -> b[]
 * @param b : b
 * @returns fa: a[] -> b[]
 *
 * @example
 * ```ts
 * pipe([1,2,3], as(0)) // [0,0,0]
 * ```
 */
export const as = tfunctor.as(Functor);

/**
 * doubleMap :: (a -> b) -> a[][] -> b[][]
 * @param f : a -> b
 * @returns fa: a[][] -> b[][]
 *
 * @example
 * ```ts
 * pipe([[1,2,3],[4,5,6]], doubleMap(x => x + 1)) // [[2,3,4],[5,6,7]]
 * ```
 */
export const doubleMap = tfunctor.mapCompose(Functor, Functor);

/**
 * ap :: `a[] -> (a -> b)[] -> b[]`
 *
 * ap :: `<A, B>(fa: A[]) => (fab: (a: A) => B[]) => B[]`
 *
 * @param fa `a[]`
 * @returns `(a -> b)[] -> b[]`
 *
 * @example
 * ```ts
 * pipe(of(x=>x+1), ap([1,2,3])) // [2,3,4]
 */
export const ap = Applicative.ap;

/**
 * liftA2 :: `(a b -> c) -> a[] -> b[] -> c[]`
 *
 * liftA2 :: `<A, B, C>(f: (a: A, b: B) => C) => (fa: A[]) => (fb: B[]) => C[]`
 *
 * @param f `(a b -> c)`
 * @returns `a[] -> b[] -> c[]`
 *
 * @example
 * ```ts
 * pipe([1,2,3],pipe([1,2,3],liftA2((a, b) => a + b))) // [2,3,4,3,4,5,4,5,6]
 * pipe([1,2,3],pipe([1,2,3],liftA2((a,b)=> [a,b]))) // [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]]
 * ```
 */
export const liftA2 = tApplicative.liftA2(Applicative);

/**
 * product :: `a[] -> b[] -> [a, b][]`
 *
 * product :: `<A, B>(fa: A[]) => (fb: B[]) => [A, B][]`
 *
 * @param fa `a[]`
 * @returns `b[] -> [a, b][]`
 *
 * @example
 * ```ts
 * pipe([1,2,3], product([1,2,3])) // [[1,1],[1,2],[1,3],[2,1],[2,2],[2,3],[3,1],[3,2],[3,3]]
 * ```
 */
export const aproduct = tApplicative.product(Applicative);

/**
 * productMany :: `a[] -> a[][] -> a[][]`
 *
 * productMany :: `<A>(fa: A[]) => (faa: A[][]) => A[][]`
 *
 * @param fa `a[]`
 * @returns `a[][] -> a[][]`
 *
 * @example
 * ```ts
 * pipe([[1,2,3],[4,5,6]], productMany([1,2,3])) // [[1,1,4],[1,1,5],[1,1,6],[1,2,4],[1,2,5],[1,2,6],[1,3,4],[1,3,5],[1,3,6],[2,1,4],[2,1,5],[2,1,6],[2,2,4],[2,2,5],[2,2,6],[2,3,4],[2,3,5],[2,3,6],[3,1,4],[3,1,5],[3,1,6],[3,2,4],[3,2,5],[3,2,6],[3,3,4],[3,3,5],[3,3,6]]
 * ```
 */
export const productMany = tApplicative.productMany(Applicative);

/**
 * zipWith :: `(a b -> c) -> a[] -> b[] -> c[]`
 *
 * zipWith :: `<A, B, C>(f: (a: A, b: B) => C) => (fa: A[]) => (fb: B[]) => C[]`
 *
 * @param f `(a b -> c)`
 * @returns `a[] -> b[] -> c[]`
 *
 * @example
 * ```ts
 * pipe([1,2,3], pipe([1,2,3], zipWith((a, b) => a + b))) // [2,4,6]
 * ```
 */
export const zipWith = SemiAlign.zipWith;

/**
 * zip :: `a[] -> b[] -> [a, b][]`
 *
 * zip :: `<A, B>(fa: A[]) => (fb: B[]) => [A, B][]`
 *
 * @param fa `a[]`
 * @returns `b[] -> [a, b][]`
 *
 * @example
 * ```ts
 * pipe([4,5,6], zip([1,2,3])) // [[1,4],[2,5],[3,6]]
 * ```
 */
export const zip = tSemiAlign.zip(SemiAlign);

/**
 * flatMap :: `(a -> b[]) -> a[] -> b[]`
 *
 * flatMap :: `<A, B>(f: (a: A) => B[]) => (fa: A[]) => B[]`
 *
 * @param f `(a -> b[])`
 * @returns `a[] -> b[]`
 *
 * @example
 * ```ts
 * pipe([1,2,3], flatMap(x => [x, x+1])) // [1,2,2,3,3,4]
 * ```
 */
export const flatMap = Monad.flatMap;

/**
 * flatten :: a[][] -> a[]
 *
 * flatten :: `<A>(faa: A[][]) => A[]`
 *
 * @param faa `a[][]`
 * @returns `a[]`
 *
 * @example
 * ```ts
 * pipe([[1,2,3],[4,5,6]], flatten) // [1,2,3,4,5,6]
 * ```
 */
export const flatten = tMonad.flatten(Monad);

/**
 * reduce :: `(b a -> b) b -> a[] -> b`
 *
 * reduce :: `<A, B>(f: (b: B, a: A) => B, b: B) => (fa: A[]) => B`
 *
 * @param f `(b a -> b)`
 * @param b `b`
 * @returns `a[] -> b`
 *
 * @example
 * ```ts
 * pipe([1,2,3], reduce((b, a) => b + a, 0)) // 6
 * ```
 */
export const reduce = Foldable.reduce;

export const reduceRight =
  <A, B>(f: (acc: B, item: A) => B, init: B) =>
  (fa: A[]) => {
    let acc = init;
    for (let i = fa.length - 1; i >= 0; i--) {
      acc = f(acc, fa[i]);
    }
    return acc;
  };

export const scan =
  <A, B>(f: (b: B, a: A) => B, init: B) =>
  (fa: A[]) => {
    const scan: B[] = [];
    let sum = init;
    for (const item of fa) {
      sum = f(sum, item);
      scan.push(sum);
    }
    return scan;
  };

export const scanRight =
  <A, B>(f: (b: B, a: A) => B, init: B) =>
  (fa: A[]) => {
    const scan: B[] = [];
    let sum = init;
    for (let i = fa.length - 1; i >= 0; i--) {
      sum = f(sum, fa[i]);
      scan.push(sum);
    }
    return scan;
  };

/**
 * filterMap :: `(a -> Option<b>) -> a[] -> b[]`
 *
 * filterMap :: `<A, B>(f: (a: A) => Option<B>) => (fa: A[]) => B[]`
 *
 * @param f `(a -> Option<b>)`
 * @returns `a[] -> b[]`
 *
 * @example
 * ```ts
 * pipe([1,2,3], filterMap(x => x > 1 ? some(x) : none)) // [2,3]
 * ```
 */
export const filterMap = Filterable.filterMap;

/**
 * filter :: `(a -> boolean) -> a[] -> a[]`
 *
 * filter :: `<A>(f: (a: A) => boolean) => (fa: A[]) => A[]`
 *
 * @param f `(a -> boolean)`
 * @returns `a[] -> a[]`
 *
 * @example
 * ```ts
 * pipe([1,2,3], filter(x => x > 1)) // [2,3]
 * ```
 */
export const filter = (f => fa => fa.filter(f)) as tFilterable.Filterable.$filter<TArray>;

/**
 * compact :: Option<a>[] -> a[]
 *
 * compact :: `<A>(fa: Option<A>[]) => A[]`
 *
 * @param fa `Option<a>[]`
 * @returns `a[]`
 *
 * @example
 * ```ts
 * pipe([some(1), none, some(2)], compact) // [1,2]
 * ```
 */
export const compact = tFilterable.compact(Filterable);

export const traverse: <F extends Kind>(
  F: tApplicative.Applicative<F>,
) => tTraversable.Traversable.$traverse<TArray, F> = Traversable.traverse;

export const sequence: <F extends Kind>(
  F: tApplicative.Applicative<F>,
) => tTraversable.Traversable.$sequence<TArray, F> = tTraversable.sequence(Traversable);

export const range = (start: number, end: number, step = 1) => {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
};

export const orElse = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);

export const concat = or;

export const concatMany = <A>(...faa: A[][]) => {
  return faa.reduce((acc, fa) => acc.concat(fa), zero());
};

export const append = <A>(a: A) => concat(of(a));

export const prepend =
  <A>(a: A) =>
  (fa: A[]) =>
    pipe(of(a), concat(fa));

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);

export const takeWhile =
  <A>(f: (a: A) => boolean) =>
  (fa: A[]) => {
    const result: A[] = [];
    for (const a of fa) {
      if (!f(a)) return result;
      result.push(a);
    }
    return result;
  };

export const take =
  (count: number) =>
  <A>(fa: A[]) => {
    const result: A[] = [];
    for (const a of fa) {
      if (result.length >= count) return result;
      result.push(a);
    }
    return result;
  };

export const dropWhile =
  <A>(f: (a: A) => boolean) =>
  (fa: A[]) => {
    const result: A[] = [];
    for (const a of fa) {
      if (f(a)) continue;
      result.push(a);
    }
    return result;
  };

export const drop =
  (count: number) =>
  <A>(fa: A[]) =>
    fa.slice(count);

export const head = <A>(fa: A[]): O.Option<A> => (fa.length === 0 ? O.none() : O.some(fa[0]));

export const tail = drop(1);

export const list: <A>(fa: A[]) => [A, A[]] = fa => [fa[0], tail(fa)];

export const last = <A>(fa: A[]): O.Option<A> => (fa.length === 0 ? O.none() : O.some(fa[fa.length - 1]));

export const enumerate = <A>(fa: A[]) => fa.map((a, i) => [a, i] as [A, number]);

export const unique = <A>(fa: A[]) => [...new Set(fa)];

export const duplicate = flatMap(<A>(a: A) => [a, a]);

export const reverse = <A>(fa: A[]) => [...fa].reverse();

export const some =
  <A>(f: (a: A) => boolean) =>
  (fa: A[]) =>
    fa.some(f);

export const every =
  <A>(f: (a: A) => boolean) =>
  (fa: A[]) =>
    fa.every(f);

export const find =
  <A>(f: (a: A) => boolean) =>
  (fa: A[]): O.Option<A> => {
    const result = fa.find(f);
    if (result === undefined) return O.none();
    return O.some(result);
  };

export const findIndex =
  <A>(f: (a: A) => boolean) =>
  (fa: A[]): O.Option<number> => {
    const result = fa.findIndex(f);
    if (result === -1) return O.none();
    return O.some(result);
  };

export const findLast =
  <A>(f: (a: A) => boolean) =>
  (fa: A[]): O.Option<A> => {
    for (let i = fa.length - 1; i >= 0; i--) {
      const a = fa[i];
      if (f(a)) return O.some(a);
    }
    return O.none();
  };

export const findLastIndex =
  <A>(f: (a: A) => boolean) =>
  (fa: A[]): O.Option<number> => {
    for (let i = fa.length - 1; i >= 0; i--) {
      if (f(fa[i])) return O.some(i);
    }
    return O.none();
  };

export const includes =
  <A>(a: A) =>
  (fa: A[]) =>
    fa.includes(a);

export const isEmpty = <A>(fa: A[]) => fa.length === 0;

export const count = <A>(fa: A[]) => fa.length;

export const length = count;

export const fold = <A>(monoid: tGroups.Monoid<A>) => reduce(monoid.concat, monoid.identity);

export const sum = fold(GroupSum);

export const product = fold(GroupProduct);

export const max = fold(MonoidMax);

export const min = fold(MonoidMin);

export const alternateFold = <A>(group: tGroups.Group<A>) => {
  let sum = group.identity;
  let index = 0;
  return (fa: A[]) => {
    for (const item of fa) {
      sum = index++ % 2 === 0 ? group.concat(sum, item) : group.concat(sum, group.invert(item));
    }
    return sum;
  };
};

export const alternateSum = alternateFold(GroupSum);

export const alternateProduct = alternateFold(GroupProduct);
