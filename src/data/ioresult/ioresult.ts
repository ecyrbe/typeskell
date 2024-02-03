import { Kind } from '@kinds';
import * as R from '@data/result';
import * as I from '@data/io';
import * as tfunctor from '@typeclass/functor';
import * as tbifunctor from '@typeclass/bifunctor';
import * as tOf from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tFlip from '@typeclass/flip';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tBiFlatMap from '@typeclass/biflatmap';
import * as tFoldable from '@typeclass/foldable';
import * as tTraversable from '@typeclass/traversable';
import * as tSemiAlternative from '@typeclass/semialternative';
import { pipe } from '@utils/pipe';

export interface IOResult<A, E> extends I.IO<R.Result<A, E>> {}

export interface TIOResult extends Kind.binary {
  return: IOResult<this['arg0'], this['arg1']>;
}

export const err: <E, A = unknown>(e: E) => IOResult<A, E> = e => I.of(R.err(e));

export const ok: <A, E = unknown>(a: A) => IOResult<A, E> = a => I.of(R.ok(a));

export const runIO = <A, E>(io: IOResult<A, E>): R.Result<A, E> => io();

export const Of: tOf.Of<TIOResult> = {
  of: ok,
};

export const BiFunctor: tbifunctor.BiFunctor<TIOResult> = {
  bimap: (f, g) => I.map(R.bimap(f, g)),
};

export const Functor: tfunctor.Functor<TIOResult> = {
  map: tfunctor.mapCompose(I.Functor, R.Functor),
};

export const To: tTo.To<TIOResult> = {
  getOrElse: f => io => pipe(runIO(io), R.getOrElse(f)),
};

export const Flip: tFlip.Flip<TIOResult> = {
  flip: I.map(R.flip),
};

export const Applicative: tApplicative.Applicative<TIOResult> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(I.Applicative, R.Applicative),
};

export const Monad: tMonad.Monad<TIOResult> = {
  ...Applicative,
  flatMap: f => I.map(R.flatMap(a => runIO(f(a)))),
};

export const BiFlatMap: tBiFlatMap.BiFlatMap<TIOResult> = {
  ...Of,
  ...BiFunctor,
  biFlatMap: (f, g) =>
    I.map(
      R.biFlatMap(
        a => runIO(f(a)),
        e => runIO(g(e)),
      ),
    ),
};

export const Foldable: tFoldable.Foldable<TIOResult> = {
  reduce: (f, b) => io => pipe(runIO(io), R.reduce(f, b)),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TIOResult> = {
  ...Functor,
  orElse: fb => fa => () => pipe(fa, I.map(R.orElse(fb())))(),
};

const $traverse: (
  applicative: tApplicative.Applicative<Kind.F>,
) => tTraversable.Traversable.$traverse<TIOResult, Kind.F> = applicative => f => fa =>
  pipe(fa(), R.traverse(applicative)(f), applicative.map(I.of));

export const Traversable: tTraversable.Traversable<TIOResult> = {
  ...Functor,
  ...Foldable,
  traverse: $traverse as any,
};

export const of = Of.of;

export const getOrElse = To.getOrElse;

export const getOr = tTo.getOr(To);

export const bimap = BiFunctor.bimap;

export const map = Functor.map;

export const mapCompose = tfunctor.mapCompose(Functor, Functor);

export const flap = tfunctor.flap(Functor);

export const as = tfunctor.as(Functor);

export const flip = Flip.flip;

export const ap = Applicative.ap;

export const liftA2 = tApplicative.liftA2(Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

export const flatMap = Monad.flatMap;

export const andThen = flatMap;

export const chain = flatMap;

export const flatten = tMonad.flatten(Monad);

export const biFlatMap = BiFlatMap.biFlatMap;

export const orElse = tBiFlatMap.orElse(BiFlatMap);

export const reduce = Foldable.reduce;

export const orElseAlt = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);

export const traverse: <F extends Kind>(
  F: tApplicative.Applicative<F>,
) => tTraversable.Traversable.$traverse<TIOResult, F> = Traversable.traverse as any;

export const sequence: <F extends Kind>(
  F: tApplicative.Applicative<F>,
) => tTraversable.Traversable.$sequence<TIOResult, F> = tTraversable.sequence(Traversable) as any;

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
