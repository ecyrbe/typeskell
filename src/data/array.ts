import { Kind, $ } from '@kinds';
import * as tfunctor from '@typeclass/functor';
import { type Of as tOf } from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tSemiAlign from '@typeclass/semialign';
import * as tMonad from '@typeclass/monad';
import * as tFoldable from '@typeclass/foldable';
import * as tFilterable from '@typeclass/filterable';
import * as tTraversable from '@typeclass/traversable';
import * as tGroups from '@typeclass/groups';
import { OptionOf, isSome, none, some } from './option';
import { pipe } from '../pipe';

export type TArray = Kind.Array;

export const Zero: tZero.Zero<TArray> = {
  zero: () => [],
};

export const Of: tOf<TArray> = {
  of: a => [a],
};

export const To: tTo.To<TArray> = {
  getOrElse: f => fa => (fa.length === 0 ? f() : fa[0]),
};

export const OptionalTo: tTo.OptionalTo<TArray> = {
  ...To,
  get: fa => (fa.length === 0 ? none() : some(fa[0])),
};

export const Functor: tfunctor.Functor<TArray> = {
  map: f => fa => fa.map(f),
};

export const Foldable: tFoldable.Foldable<TArray> = {
  reduce: (f, b) => fa => fa.reduce(f, b),
};

export const Filterable: tFilterable.Filterable<TArray> = {
  ...Zero,
  ...Functor,
  filterMap: f => fa => {
    const result: OptionOf<ReturnType<typeof f>>[] = [];
    for (const a of fa) {
      const b = f(a);
      if (isSome(b)) {
        result.push(b.value);
      }
    }
    return result;
  },
};

export const Applicative: tApplicative.Applicative<TArray> = {
  ...Of,
  ...Functor,
  ap: fa => fab => fab.flatMap(f => fa.map(f)),
};

export const SemiAlign: tSemiAlign.SemiAlign<TArray> = {
  zipWith: f => fa => fb => {
    const result: ReturnType<typeof f>[] = [];
    const minLength = Math.min(fa.length, fb.length);
    for (let i = 0; i < minLength; i++) {
      result.push(f(fa[i], fb[i]));
    }
    return result;
  },
};

export const Monad: tMonad.Monad<TArray> = {
  ...Applicative,
  flatMap: f => fa => fa.flatMap(f),
};

const traverseImpl =
  (applicative: tApplicative.Applicative<Kind.F>) =>
  <A, B>(f: (a: A) => $<Kind.F, [B]>) =>
  (fa: A[]) => {
    return pipe(
      fa,
      reduce(
        (acc, x) =>
          pipe(
            acc,
            pipe(
              f(x),
              tApplicative.liftA2(applicative)((a, b) => (b.push(a), b)),
            ),
          ),
        applicative.of<B[]>([]),
      ),
    );
  };

export const Traversable: tTraversable.Traversable<TArray> = {
  ...Functor,
  ...Foldable,
  traverse: traverseImpl as any,
};

export const MonoidKind: tGroups.MonoidKind<TArray> = {
  ...Zero,
  monoid: () => ({
    concat: (a, b) => a.concat(b),
    identity: zero(),
  }),
};

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
export const product = tApplicative.product(Applicative);

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

export const traverse: tTraversable.Traversable<TArray>['traverse'] = Traversable.traverse;

export const sequence: ReturnType<typeof tTraversable.sequence<TArray>> = tTraversable.sequence(Traversable);

export const concat =
  <A>(a: A[]) =>
  (b: A[]) =>
    MonoidKind.monoid<A>().concat(a, b);
