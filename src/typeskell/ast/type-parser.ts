import { Inc, Dec } from '@utils/numbers';
import { Tail } from '@utils/tuples';

export type TrimParens<T extends string> = T extends `(${infer U})` ? U : T;

type StringToTuple<T extends string, $acc extends unknown[] = []> = T extends `${infer A}${infer B}`
  ? StringToTuple<B, [...$acc, A]>
  : $acc;

type TrimLeft<T extends string> = T extends ` ${infer U}` ? TrimLeft<U> : T;
type TrimRight<T extends string> = T extends `${infer U} ` ? TrimRight<U> : T;
export type Trim<T extends string> = TrimLeft<TrimRight<T>>;

type SplitTupleFnWithParens<
  T extends string[],
  $accTuple extends unknown[] = [],
  $acc extends string = '',
  $nested extends number = 0,
> = T extends [infer Char extends string, ...infer Rest extends string[]]
  ? Char extends `(`
    ? SplitTupleFnWithParens<Rest, $accTuple, `${$acc}${Char}`, Inc<$nested>>
    : Char extends `)`
      ? SplitTupleFnWithParens<Rest, $accTuple, `${$acc}${Char}`, Dec<$nested>>
      : $nested extends 0
        ? [Char, Rest[0]] extends ['-', '>']
          ? SplitTupleFnWithParens<Tail<Rest>, [...$accTuple, Trim<$acc>], '', 0>
          : SplitTupleFnWithParens<Rest, $accTuple, `${$acc}${Char}`, 0>
        : SplitTupleFnWithParens<Rest, $accTuple, `${$acc}${Char}`, $nested>
  : [...$accTuple, Trim<$acc>];

export type SplitFnWithParens<Input extends string> = SplitTupleFnWithParens<StringToTuple<Input>>;

type SplitTupleParamWithParens<
  T extends string[],
  $accTuple extends unknown[] = [],
  $acc extends string = '',
  $nested extends number = 0,
> = T extends [infer Char extends string, ...infer Rest extends string[]]
  ? Char extends `(`
    ? SplitTupleParamWithParens<Rest, $accTuple, `${$acc}${Char}`, Inc<$nested>>
    : Char extends `)`
      ? SplitTupleParamWithParens<Rest, $accTuple, `${$acc}${Char}`, Dec<$nested>>
      : $nested extends 0
        ? Char extends ' '
          ? $acc extends ''
            ? SplitTupleParamWithParens<Rest, $accTuple>
            : SplitTupleParamWithParens<Rest, [...$accTuple, Trim<$acc>], '', 0>
          : SplitTupleParamWithParens<Rest, $accTuple, `${$acc}${Char}`, 0>
        : SplitTupleParamWithParens<Rest, $accTuple, `${$acc}${Char}`, $nested>
  : Trim<$acc> extends ''
    ? $accTuple
    : [...$accTuple, Trim<$acc>];

export type SplitParamWithParens<Input extends string> = SplitTupleParamWithParens<StringToTuple<Input>>;
