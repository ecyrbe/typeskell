export function pipe<A, B>(input: A, fn: (input: A) => B): B;
export function pipe<A, B, C>(input: A, fn1: (input: A) => B, fn2: (input: B) => C): C;
export function pipe<A, B, C, D>(input: A, fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D): D;
export function pipe<A, B, C, D, E>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
): H;
export function pipe<A, B, C, D, E, F, G, H, I>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
): I;
export function pipe<A, B, C, D, E, F, G, H, I, J>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
  fn9: (input: I) => J,
): J;
export function pipe<A, B, C, D, E, F, G, H, I, J, K>(
  input: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
  fn9: (input: I) => J,
  fn10: (input: J) => K,
): K;
export function pipe(input: any, ...fns: ((input: any) => any)[]) {
  return fns.reduce((acc, fn) => fn(acc), input);
}

export function flow<A, B>(fn: (input: A) => B): (input: A) => B;
export function flow<A, B, C>(fn1: (input: A) => B, fn2: (input: B) => C): (input: A) => C;
export function flow<A, B, C, D>(fn1: (input: A) => B, fn2: (input: B) => C, fn3: (input: C) => D): (input: A) => D;
export function flow<A, B, C, D, E>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
): (input: A) => E;
export function flow<A, B, C, D, E, F>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
): (input: A) => F;
export function flow<A, B, C, D, E, F, G>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
): (input: A) => G;
export function flow<A, B, C, D, E, F, G, H>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
): (input: A) => H;
export function flow<A, B, C, D, E, F, G, H, I>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
): (input: A) => I;
export function flow<A, B, C, D, E, F, G, H, I, J>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
  fn9: (input: I) => J,
): (input: A) => J;
export function flow<A, B, C, D, E, F, G, H, I, J, K>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
  fn9: (input: I) => J,
  fn10: (input: J) => K,
): (input: A) => K;
export function flow(...fns: ((input: any) => any)[]) {
  return (input: any) => fns.reduce((acc, fn) => fn(acc), input);
}

export function compose<A, B>(fn: (input: A) => B): (input: A) => B;
export function compose<A, B, C>(fn1: (input: B) => C, fn2: (input: A) => B): (input: A) => C;
export function compose<A, B, C, D>(fn1: (input: C) => D, fn2: (input: B) => C, fn3: (input: A) => B): (input: A) => D;
export function compose<A, B, C, D, E>(
  fn1: (input: D) => E,
  fn2: (input: C) => D,
  fn3: (input: B) => C,
  fn4: (input: A) => B,
): (input: A) => E;
export function compose<A, B, C, D, E, F>(
  fn1: (input: E) => F,
  fn2: (input: D) => E,
  fn3: (input: C) => D,
  fn4: (input: B) => C,
  fn5: (input: A) => B,
): (input: A) => F;
export function compose<A, B, C, D, E, F, G>(
  fn1: (input: F) => G,
  fn2: (input: E) => F,
  fn3: (input: D) => E,
  fn4: (input: C) => D,
  fn5: (input: B) => C,
  fn6: (input: A) => B,
): (input: A) => G;
export function compose<A, B, C, D, E, F, G, H>(
  fn1: (input: G) => H,
  fn2: (input: F) => G,
  fn3: (input: E) => F,
  fn4: (input: D) => E,
  fn5: (input: C) => D,
  fn6: (input: B) => C,
  fn7: (input: A) => B,
): (input: A) => H;
export function compose<A, B, C, D, E, F, G, H, I>(
  fn1: (input: H) => I,
  fn2: (input: G) => H,
  fn3: (input: F) => G,
  fn4: (input: E) => F,
  fn5: (input: D) => E,
  fn6: (input: C) => D,
  fn7: (input: B) => C,
  fn8: (input: A) => B,
): (input: A) => I;
export function compose<A, B, C, D, E, F, G, H, I, J>(
  fn1: (input: I) => J,
  fn2: (input: H) => I,
  fn3: (input: G) => H,
  fn4: (input: F) => G,
  fn5: (input: E) => F,
  fn6: (input: D) => E,
  fn7: (input: C) => D,
  fn8: (input: B) => C,
  fn9: (input: A) => B,
): (input: A) => J;
export function compose<A, B, C, D, E, F, G, H, I, J, K>(
  fn1: (input: J) => K,
  fn2: (input: I) => J,
  fn3: (input: H) => I,
  fn4: (input: G) => H,
  fn5: (input: F) => G,
  fn6: (input: E) => F,
  fn7: (input: D) => E,
  fn8: (input: C) => D,
  fn9: (input: B) => C,
  fn10: (input: A) => B,
): (input: A) => K;
export function compose(...fns: ((input: any) => any)[]) {
  return (input: any) => fns.reduceRight((acc, fn) => fn(acc), input);
}
