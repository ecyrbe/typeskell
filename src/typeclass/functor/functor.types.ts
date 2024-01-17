import { Kind, $ } from '@kinds';
import { GenericFn } from '@utils/functions';
import { Dec } from '@utils/numbers';
import { SplitAt } from '@utils/tuples';

export type FunctorSignature<F extends Kind> = GenericFn<2, FunctorMetaParams, FunctorMetaResult<F>>;

type BuildTypeMap<T> = T extends unknown[] ? [['m', 'a', 'b'], ['M', ...T]] : never;
type BuildTypeMap2<T> = T extends unknown[] ? { a: T[0]; b: T[1] } : never;

export interface FunctorMetaParams extends Kind {
  return: [f: BuildAB<BuildTypeMap<this['rawArgs']>>];
}

type GetPos<
  T extends string[],
  Key extends string,
  $iter extends keyof T = keyof T,
> = $iter extends `${infer index extends number}` ? (T[$iter] extends Key ? index : never) : never;

type Get<
  T,
  K extends string,
  $pos extends number = T extends [string[], unknown[]] ? GetPos<T[0], K> : never,
> = T extends [string[], unknown[]] ? T[1][$pos] : never;

export type Filter<T, U extends string[], $acc extends [string[], unknown[]] = [[], []]> = U extends [
  infer H extends string,
  ...infer R extends string[],
]
  ? Filter<T, R, [[...$acc[0], H], [...$acc[1], Get<T, H>]]>
  : $acc;

type testFilter = Filter<[['a', 'b', 'c'], [1, 2, 3]], ['b', 'a']>;
type Filter2<T, U extends string[], $acc extends Record<string, unknown> = {}> = U extends [
  infer H extends string,
  ...infer R extends string[],
]
  ? T extends Record<string, unknown>
    ? Filter2<T, R, $acc & { [K in H]: T[K] }>
    : $acc
  : $acc;

type testFilter2 = Filter2<{ a: 1; b: 2; c: 3 }, ['b', 'a']>;

type BuildAB<T, $a = Filter<T, ['a']>, $b = Filter<T, ['b']>> = GenericFn<0, FunctorAParams<$a>, FunctorBResult<$b>>;

export interface FunctorMetaResult<F extends Kind> extends Kind {
  return: this['rawArgs'] extends [infer A, infer B]
    ? GenericFn<Dec<F['arity']>, FunctorParams<F, A>, FunctorResult<F, B>, 'B'>
    : never;
}

type GetFromList<key, typeNameList extends string[], typeList> = typeNameList extends [
  ...infer Rest extends string[],
  infer Last,
]
  ? Last extends key
    ? typeList extends unknown[]
      ? typeList[Rest['length']]
      : never
    : GetFromList<key, Rest, typeList>
  : never;

export interface FunctorAParams<T> extends Kind {
  return: T extends [string[], unknown[]] ? [a: GetFromList<'a', T[0], T[1]>] : never;
}

export interface FunctorBResult<T> extends Kind {
  return: T extends [string[], unknown[]] ? GetFromList<'b', T[0], T[1]> : never;
}

export interface FunctorParams<F extends Kind, A> extends Kind {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, [A, ...this['rawArgs']]>] : never;
}

export interface FunctorResult<F extends Kind, B> extends Kind {
  return: this['rawArgs'] extends unknown[] ? $<F, [B, ...this['rawArgs']]> : never;
}

export interface FunctorCompositionParams<F extends Kind, G extends Kind, A> extends Kind {
  return: this['rawArgs'] extends unknown[]
    ? SplitAt<Dec<F['arity']>, this['rawArgs']> extends [infer FB extends unknown[], infer GB extends unknown[]]
      ? [fa: $<F, [$<G, [A, ...GB]>, ...FB]>]
      : never
    : never;
}

export interface FunctorCompositionResult<F extends Kind, G extends Kind, B> extends Kind {
  return: this['rawArgs'] extends unknown[]
    ? SplitAt<Dec<F['arity']>, this['rawArgs']> extends [infer FB extends unknown[], infer GB extends unknown[]]
      ? $<F, [$<G, [B, ...GB]>, ...FB]>
      : never
    : never;
}

export interface FlapParams<F extends Kind, A> extends Kind {
  return: this['rawArgs'] extends [infer B, ...infer Rest] ? [fab: $<F, [(a: A) => B, ...Rest]>] : never;
}

export interface FlapResult<F extends Kind> extends Kind {
  return: this['rawArgs'] extends unknown[] ? $<F, [...this['rawArgs']]> : never;
}

export interface FunctorAsParams<F extends Kind> extends Kind {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, this['rawArgs']>] : never;
}

export interface FunctorAsResult<F extends Kind, B> extends Kind {
  return: this['rawArgs'] extends [any, ...infer Args] ? $<F, [B, ...Args]> : never;
}
