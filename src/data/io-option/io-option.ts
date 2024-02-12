import { Kind } from '@kinds';
import * as O from '@data/option';
import * as I from '@data/io';
import * as tFunctor from '@typeclass/functor';
import * as tZero from '@typeclass/zero';
import * as tOf from '@typeclass/of';
import * as tTo from '@typeclass/to';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tFoldable from '@typeclass/foldable';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tFilterable from '@typeclass/filterable';
import { pipe } from '@utils/pipe';

export interface IOOption<A> extends I.IO<O.Option<A>> {}

export interface TIOOption extends Kind.unary {
  return: IOOption<this['arg0']>;
}

export const none: <A = never>() => IOOption<A> = () => I.of(O.none());

export const some: <A>(a: A) => IOOption<A> = a => I.of(O.some(a));

export const run = <A>(io: IOOption<A>): O.Option<A> => io();

export const Zero: tZero.Zero<TIOOption> = {
  zero: none,
};

export const Of: tOf.Of<TIOOption> = {
  of: some,
};

export const Functor: tFunctor.Functor<TIOOption> = {
  map: tFunctor.mapCompose(I.Functor, O.Functor),
};

export const To: tTo.To<TIOOption> = {
  getOrElse: f => io => pipe(io(), O.getOrElse(f)),
};

export const Applicative: tApplicative.Applicative<TIOOption> = {
  ...Of,
  ...Functor,
  ap: tApplicative.apCompose(I.Applicative, O.Applicative),
};

export const Monad: tMonad.Monad<TIOOption> = {
  ...Applicative,
  flatMap: f => io => pipe(io, I.map(O.flatMap(a => run(f(a))))),
};

export const Foldable: tFoldable.Foldable<TIOOption> = {
  reduce: (f, b) => io => pipe(io(), O.reduce(f, b)),
};

export const Filterable: tFilterable.Filterable<TIOOption> = {
  ...Functor,
  ...Zero,
  filterMap: f => io => pipe(io, I.map(O.filterMap(f))),
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TIOOption> = {
  ...Functor,
  orElse: alt => io => () => pipe(io, I.map(O.orElse(alt())))(),
};

export const fromIO: <A>(io: I.IO<A>) => IOOption<A> = I.map(O.some);

export const of = Of.of;

export const getOrElse = To.getOrElse;

export const getOr = tTo.getOr(To);

export const map = Functor.map;

export const mapCompose = tFunctor.mapCompose(Functor, Functor);

export const flap = tFunctor.flap(Functor);

export const as = tFunctor.as(Functor);

export const ap = Applicative.ap;

export const liftA2 = tApplicative.liftA2(Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

export const flatMap = Monad.flatMap;

export const andThen = flatMap;

export const chain = flatMap;

export const flatten = tMonad.flatten(Monad);

export const filterMap = Filterable.filterMap;

export const filter = tFilterable.filter(Filterable);

export const compact = tFilterable.compact(Filterable);

export const reduce = Foldable.reduce;

export const orElse = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);

export const pluck = <A, K extends keyof A>(k: K) => map((a: A) => a[k]);
