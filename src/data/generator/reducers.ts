import * as A from '@data/array';
import * as O from '@data/option';
import { pipe } from '@utils/pipe';
import { Group, Monoid } from '@typeclass/groups';
import { GroupProduct, GroupSum, MonoidMin, MonoidMax } from '@data/number';

export const reduce =
  <A, B>(f: (acc: B, item: A) => B, initial: B) =>
  (fa: Generator<A>) => {
    let acc = initial;
    for (const item of fa) {
      acc = f(acc, item);
    }
    return acc;
  };

export const some =
  <A>(f: (a: A) => boolean) =>
  (fa: Generator<A>) => {
    for (const item of fa) {
      if (f(item)) return true;
    }
    return false;
  };

export const every =
  <A>(f: (a: A) => boolean) =>
  (fa: Generator<A>) => {
    for (const item of fa) {
      if (!f(item)) return false;
    }
    return true;
  };

export const find =
  <A>(f: (a: A) => boolean) =>
  (fa: Generator<A>): O.Option<A> => {
    for (const item of fa) {
      if (f(item)) return O.some(item);
    }
    return O.none();
  };

export const includes =
  <A>(a: A) =>
  (fa: Generator<A>) => {
    for (const item of fa) {
      if (item === a) return true;
    }
    return false;
  };

export const fold = <A>(m: Monoid<A>) => reduce(m.concat, m.identity);

export const sum = fold(GroupSum);

export const product = fold(GroupProduct);

export const min = fold(MonoidMin);

export const max = fold(MonoidMax);

export const alternateFold =
  <A>(g: Group<A>) =>
  (fa: Generator<A>) => {
    let acc = g.identity;
    let index = 0;
    for (const item of fa) {
      acc = index++ % 2 === 0 ? g.concat(acc, item) : g.concat(acc, g.invert(item));
    }
    return acc;
  };

export const alternateSum = alternateFold(GroupSum);

export const alternateProduct = alternateFold(GroupProduct);

export const average = (fa: Generator<number>) => {
  let sum = 0;
  let count = 0;
  for (const item of fa) {
    sum += item;
    count++;
  }
  if (count === 0) return 0;
  return sum / count;
};

export const count = (fa: Generator<unknown>) => {
  let count = 0;
  for (const _ of fa) {
    count++;
  }
  return count;
};

export const unzip = <A, B>(fa: Generator<[A, B]>) => {
  const as: A[] = [];
  const bs: B[] = [];
  for (const [a, b] of fa) {
    as.push(a);
    bs.push(b);
  }
  return [as, bs] as [A[], B[]];
};

export const partition =
  <A>(f: (a: A) => boolean) =>
  (fa: Generator<A>) => {
    const left: A[] = [];
    const right: A[] = [];
    for (const item of fa) {
      if (f(item)) {
        left.push(item);
      } else {
        right.push(item);
      }
    }
    return [left, right] as [A[], A[]];
  };

export const collect = <A>(fa: Generator<A>) => A.from(fa);
export const collectSet = <A>(fa: Generator<A>) => new Set(fa);
export const collectMap = <A, B>(fa: Generator<[A, B]>) => new Map(fa);
