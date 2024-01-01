import { InvariantParam, CovariantParam, ContravariantParam } from './variance';

type DefaultParamMap = {
  invariant: unknown;
  covariant: never;
  contravariant: unknown;
};

type DefaultParam<T> = T extends InvariantParam | CovariantParam | ContravariantParam
  ? DefaultParamMap[T['type']]
  : never;

export type ToDefaultParam<T extends unknown[], $acc extends unknown[] = []> = T extends [infer Head, ...infer Tail]
  ? ToDefaultParam<Tail, [...$acc, DefaultParam<Head>]>
  : $acc;
