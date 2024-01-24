import { Kind, $ } from '@kinds';
import { Functor } from './functor';
import { identity } from '@utils/functions';
import { pipe, compose } from '../../pipe';
// Laws:
//  - Identity: map id = id
//  - Composition: map (f . g) = map f . map g
export const functorLaws = (functor: Functor<Kind.F>) => {
  const { map } = functor;

  return {
    identity: <A>(fa: $<Kind.F, [A]>) => pipe(fa, map(identity)) === fa,
    composition:
      <A, B, C>(f: (b: B) => C, g: (a: A) => B) =>
      (fa: $<Kind.F, [A]>) =>
        pipe(fa, map(compose(f, g))) === pipe(fa, compose(map(f), map(g))),
  };
};
