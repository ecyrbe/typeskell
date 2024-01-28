import { Option, isSome } from '@data/option';
import { identity } from '@utils/functions';
import { ReadonlyTuple } from '@utils/tuples';

export const filterMap = <A, B>(f: (a: A) => Option<B>) =>
  function* (fa: Generator<A>) {
    for (const a of fa) {
      const result = f(a);
      if (isSome(result)) yield result.value;
    }
  };

export const flatMap = <A, B>(f: (a: A) => Generator<B>) =>
  function* (fa: Generator<A>) {
    for (const a of fa) {
      yield* f(a);
    }
  };

export function* flatten<A>(input: Generator<Generator<A>>) {
  for (const inner of input) {
    yield* inner;
  }
}

export const map = <A, B>(f: (a: A) => B) =>
  function* (fa: Generator<A>) {
    for (const a of fa) {
      yield f(a);
    }
  };

export const pluck = <A, K extends keyof A>(key: K) => map((a: A) => a[key]);

export const filter = <A>(f: (a: A) => boolean) =>
  function* (fa: Generator<A>) {
    for (const a of fa) {
      if (f(a)) yield a;
    }
  };

export const scan = <A, B>(fn: (scan: B, item: A) => B, initial: B) =>
  function* (fa: Generator<A>) {
    let scan = initial;
    for (const item of fa) {
      scan = fn(scan, item);
      yield scan;
    }
  };

export const takeWhile = <A>(fn: (item: A) => boolean) =>
  function* (fa: Generator<A>) {
    for (const item of fa) {
      if (!fn(item)) return;
      yield item;
    }
  };

export const take = (count: number) =>
  function* <A>(fa: Generator<A>) {
    let index = 0;
    for (const item of fa) {
      if (index++ >= count) return;
      yield item;
    }
  };

export const dropWhile = <A>(fn: (item: A) => boolean) =>
  function* (fa: Generator<A>) {
    for (const item of fa) {
      if (fn(item)) continue;
      yield item;
      break;
    }
    yield* fa;
  };

export const drop = (count: number) =>
  function* <A>(fa: Generator<A>) {
    let index = 0;
    for (const item of fa) {
      if (index++ < count) continue;
      yield item;
    }
  };

export const list = <A>(fa: Generator<A>) => {
  const head = fa.next();
  if (head.done) throw new Error('Cannot list an empty generator');
  return [head.value, fa] as [A, Generator<A>];
};

export const concat = <A>(fb: Generator<A>) =>
  function* (fa: Generator<A>) {
    yield* fa;
    yield* fb;
  };

export const append = <A>(item: A) =>
  function* (fa: Generator<A>) {
    yield* fa;
    yield item;
  };

export const prepend = <A>(item: A) =>
  function* (fa: Generator<A>) {
    yield item;
    yield* fa;
  };

export const cycle = (count = Infinity) =>
  function* <A>(fa: Generator<A>) {
    let index = 0;
    // save fa to an array
    const arr = [...fa];
    while (index++ < count) {
      yield* arr;
    }
  };

export const enumerate = function* <A>(fa: Generator<A>) {
  let index = 0;
  for (const a of fa) {
    yield [a, index++] as [A, number];
  }
};

export function* unique<A>(fa: Generator<A>) {
  const seen = new Set<A>();
  for (const item of fa) {
    if (!seen.has(item)) {
      seen.add(item);
      yield item;
    }
  }
}

export function* duplicate<A>(fa: Generator<A>) {
  for (const item of fa) {
    yield item;
    yield item;
  }
}

export const chunk = <N extends number>(size: N) =>
  function* <T>(fa: Generator<T>) {
    let chunk: T[] = [];
    for (const a of fa) {
      chunk.push(a);
      if (chunk.length === size) {
        yield chunk as ReadonlyTuple<T, N>;
        chunk = [];
      }
    }
    if (chunk.length > 0) yield chunk as ReadonlyTuple<T, N>;
  };

export const window = <N extends number>(size: N) =>
  function* <T>(fa: Generator<T>) {
    let window: T[] = [];
    for (const item of fa) {
      window.push(item);
      if (window.length === size) {
        yield window as ReadonlyTuple<T, N>;
        window.shift();
      }
    }
  };

export const zipWith =
  <A, B, C>(f: (a: A, b: B) => C) =>
  (fa: Generator<A>) =>
    function* (fb: Generator<B>) {
      while (true) {
        const a = fa.next();
        const b = fb.next();
        if (a.done || b.done) return;
        yield f(a.value, b.value);
      }
    };
