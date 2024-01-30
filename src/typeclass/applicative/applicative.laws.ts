import { Kind } from '@kinds';
import { Applicative } from './applicative';
import { identity } from '@utils/functions';
import { TypeSkell } from '@typeskell';
import { pipe } from '@utils/pipe';

/**
 * Applicative is a typeclass that provides a way to apply a function in a context to a value in a context.
 *
 * Laws:
 * - Identity: (of id) <*> u = u
 * - Homomorphism: (of f) <*> (of x) = of (f x)
 * - Interchange: u <*> (of y) = of ($ y) <*> u
 * - Composition: ((of (.) <*> u) <*> v) <*> w = u <*> (v <*> w)
 */

namespace applicativeLaws {
  export type $identity<F extends Kind> = TypeSkell<'F a ..e -> F a ..e', { F: F }>;
  export type $homomorphism<F extends Kind> = TypeSkell<'(a -> b) a -> F b ..e', { F: F }>;
  export type $interchange<F extends Kind> = TypeSkell<'(F (a -> b) ..e) a -> F b ..e', { F: F }>;
  export type $composition<F extends Kind> = TypeSkell<
    '(F (b -> c) ..e) (F (a -> b) ..e) (F a ..e) -> F c ..e',
    { F: F }
  >;
}

const compose =
  <A, B, C>(f: (b: B) => C) =>
  (g: (a: A) => B) =>
  (a: A) =>
    f(g(a));

const $applicativeLaws: typeof applicativeLaws<Kind.F> = applicative => {
  const { ap, of } = applicative;
  return {
    identity: {
      left: x => pipe(of(identity<(typeof x)['Args'][0]>), ap(x)),
      right: identity,
    },
    homomorphism: {
      left: (f, x) => pipe(of(f), ap(of(x))),
      right: (f, x) => of(f(x)),
    },
    interchange: {
      left: (u, y) => pipe(u, ap(of(y))),
      right: (u, y) =>
        pipe(
          of((f: (typeof u)['Args'][0]) => f(y)),
          ap(u),
        ),
    },
    composition: {
      // @ts-expect-error
      left: (u, v, w) => pipe(pipe(pipe(of(compose), ap(u)), ap(v)), ap(w)),
      right: (u, v, w) => pipe(u, ap(pipe(v, ap(w)))),
    },
  };
};

export const applicativeLaws: <F extends Kind>(
  functor: Applicative<F>,
) => {
  identity: {
    left: applicativeLaws.$identity<F>;
    right: applicativeLaws.$identity<F>;
  };
  homomorphism: {
    left: applicativeLaws.$homomorphism<F>;
    right: applicativeLaws.$homomorphism<F>;
  };
  interchange: {
    left: applicativeLaws.$interchange<F>;
    right: applicativeLaws.$interchange<F>;
  };
  composition: {
    left: applicativeLaws.$composition<F>;
    right: applicativeLaws.$composition<F>;
  };
} = $applicativeLaws as any;
