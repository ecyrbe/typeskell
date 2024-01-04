import { Kind, $ } from '@kinds';
import { ZipWithVariance } from '@kinds/variance';
import { GenericFn } from '@utils/functions';
import { Dec, Inc, Add } from '@utils/numbers';
import { Tail, SplitAt } from '@utils/tuples';

export interface FlatMapParams<F extends Kind> extends Kind {
  return: this['rawArgs'] extends [infer A, ...infer Bf] ? [f: (a: A) => $<F, Bf>] : never;
}

export interface FlatMapResult<F extends Kind> extends Kind {
  return: this['rawArgs'] extends [infer A, infer B, ...infer Bf]
    ? GenericFn<Dec<F['arity']>, FlatMapFAParams<F, A>, FlatMapFAResult<F, B, Bf>, 'B'>
    : never;
}

export interface FlatMapFAParams<F extends Kind, A> extends Kind {
  return: this['rawArgs'] extends unknown[] ? [fa: $<F, [A, ...this['rawArgs']]>] : never;
}

export interface FlatMapFAResult<F extends Kind, B, Bf> extends Kind {
  return: this['rawArgs'] extends unknown
    ? $<F, [B, ...ZipWithVariance<this['rawArgs'], Bf, Tail<F['signature']>>]>
    : never;
}

export type FlapMapSignature<F extends Kind> = GenericFn<Inc<F['arity']>, FlatMapParams<F>, FlatMapResult<F>>;

export interface FlattenParams<F extends Kind> extends Kind {
  return: this['rawArgs'] extends [infer A, ...infer AA]
    ? SplitAt<Dec<F['arity']>, AA> extends [infer A1 extends unknown[], infer A2 extends unknown[]]
      ? [mma: $<F, [$<F, [A, ...A1]>, ...A2]>]
      : never
    : never;
}

export interface FlattenResult<F extends Kind> extends Kind {
  return: this['rawArgs'] extends [infer A, ...infer AA]
    ? SplitAt<Dec<F['arity']>, AA> extends [infer A1 extends unknown[], infer A2 extends unknown[]]
      ? $<F, [A, ...ZipWithVariance<A1, A2, Tail<F['signature']>>]>
      : never
    : never;
}

export type FlattenSignature<F extends Kind> = GenericFn<
  Add<Dec<F['arity']>, F['arity']>,
  FlattenParams<F>,
  FlattenResult<F>
>;
