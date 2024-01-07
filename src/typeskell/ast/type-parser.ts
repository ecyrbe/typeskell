import { Inc, Dec } from '@utils/numbers';
import { Tail } from '@utils/tuples';
import { GreekChars, LowercaseChars, UppercaseChars } from './types';

export type TrimParens<T> = T extends `(${infer U})` ? U : T;

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

export type SplitFnWithParens<Input> = Input extends string ? SplitTupleFnWithParens<StringToTuple<Input>> : never;

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

export type SplitParamWithParens<Input> = Input extends string
  ? SplitTupleParamWithParens<StringToTuple<Input>>
  : never;

export type MapArgsAST<Input> = {
  [K in keyof Input]: ParseAST<TrimParens<Input[K]>>;
};

export type ParseArgsAST<Input extends string> = Input extends `${UppercaseChars}${string}`
  ? [ParseTypeConstructorAST<Input>]
  : MapArgsAST<SplitParamWithParens<Input>>;

export type ParseTypeConstructorAST<Input, $args = SplitParamWithParens<Input>> = $args extends [
  infer Constructor,
  ...infer Args,
  infer Last,
]
  ? Last extends `..${infer Spread}`
    ? {
        type: 'typeconstructor';
        name: Constructor;
        params: MapArgsAST<Args>;
        spread: Spread;
      }
    : {
        type: 'typeconstructor';
        name: Constructor;
        params: MapArgsAST<[...Args, Last]>;
      }
  : never;

export type ParseFromArrayToManyAST<Types> = Types extends [infer Type extends string, ...infer Rest]
  ? Rest['length'] extends 0
    ? Type extends `${UppercaseChars}${string}`
      ? [ParseTypeConstructorAST<Type>]
      : Type extends `${LowercaseChars}${string}`
        ? [{ type: 'type'; name: Type }]
        : ParseArgsAST<Type>
    : Rest['length'] extends 1
      ? [
          {
            type: 'function';
            args: ParseArgsAST<Type>;
            result: ParseAST<TrimParens<Rest[0]>>;
          },
        ]
      : [
          {
            type: 'chain';
            args: ParseArgsAST<Type>;
            result: ParseFromArrayToManyAST<Rest>[0];
          },
        ]
  : never;

export type ParseToManyAST<Input, $result = ParseFromArrayToManyAST<SplitFnWithParens<Input>>> = $result;

export type ParseAST<Input, $result = ParseToManyAST<Input>> = $result extends [infer Result, ...any[]]
  ? Result
  : never;
