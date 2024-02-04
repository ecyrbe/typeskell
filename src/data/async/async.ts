import * as tfunctor from '@typeclass/functor';
import * as tOf from '@typeclass/of';
import * as tZero from '@typeclass/zero';
import * as tApplicative from '@typeclass/applicative';
import * as tMonad from '@typeclass/monad';
import * as tSemiAlternative from '@typeclass/semialternative';
import * as tAlternative from '@typeclass/alternative';
import { TAsync, Async } from './async.types';
import { pipe } from '@utils/pipe';

export const Of: tOf.Of<TAsync> = {
  of: Promise.resolve,
};

export const Zero: tZero.Zero<TAsync> = {
  zero: () => Promise.reject('Zero Promise'),
};

const $catch =
  <A>(f: (e: unknown) => Async<A>) =>
  (fa: Async<A>) =>
    fa.catch(f);

export const Functor: tfunctor.Functor<TAsync> = {
  map: f => async fa => f(await fa),
};

export const Applicative: tApplicative.Applicative<TAsync> = {
  ...Of,
  ...Functor,
  ap: fa => flatMap(f => pipe(fa, map(f))),
};

export const Monad: tMonad.Monad<TAsync> = {
  ...Applicative,
  flatMap: Functor.map,
};

export const SemiAlternative: tSemiAlternative.SemiAlternative<TAsync> = {
  ...Functor,
  orElse: fb => fa => fa.catch(() => fb()),
};

export const Alternative: tAlternative.Alternative<TAsync> = {
  ...Zero,
  ...Applicative,
  ...SemiAlternative,
};

export const of = Of.of;

export const zero = Zero.zero;

export const map = Functor.map;

export const mapCompose = tfunctor.mapCompose(Functor, Functor);

export const flap = tfunctor.flap(Functor);

export const as = tfunctor.as(Functor);

export const ap = Applicative.ap;

export const liftA2 = tApplicative.liftA2(Applicative);

export const apCompose = tApplicative.apCompose(Applicative, Applicative);

export const product = tApplicative.product(Applicative);

export const productMany = tApplicative.productMany(Applicative);

export const flatMap = Monad.flatMap;

export const andThen = flatMap;

export const chain = flatMap;

export const flatten = tMonad.flatten(Monad);

export const orElse = SemiAlternative.orElse;

export const or = tSemiAlternative.or(SemiAlternative);

export { $catch as catch };

export const awaitAll: <A>(fa: Async<A>[]) => Async<Awaited<A>[]> = Promise.all;

export const awaitAllSettled: <A>(fa: Async<A>[]) => Async<PromiseSettledResult<Awaited<A>>[]> = Promise.allSettled;

export const awaitRace: <A>(fa: Async<A>[]) => Async<Awaited<A>> = Promise.race;

export const awaitAny: <A>(fa: Async<A>[]) => Async<Awaited<A>> = Promise.any;

export const delay =
  <A>(ms: number) =>
  (fa: Async<A>) =>
    new Promise<A>(resolve => setTimeout(() => fa.then(resolve), ms)) as Async<A>;

export const timeout =
  <A>(ms: number) =>
  (fa: Async<A>) =>
    new Promise<A>((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error('Timeout'));
      }, ms);
      fa.then(a => {
        clearTimeout(id);
        resolve(a);
      });
    }) as Async<A>;

export const makeBarrier = (n: number) => {
  const results: unknown[] = [];
  let deferredResolve: (results: unknown[]) => void;
  let deferred = new Promise<unknown[]>(resolve => {
    deferredResolve = resolve;
  });

  return <A>(a: A): Async<A[]> => {
    results.push(a);
    if (results.length >= n) {
      deferredResolve(results);
      return deferred as Async<A[]>;
    }
    return deferred as Async<A[]>;
  };
};
