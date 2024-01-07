import { describe, expectTypeOf, expect, it } from 'vitest';
import { Inc, Dec } from './numbers';
import { Tail } from './tuples';

// parse a function in haskell style and generate a generic function in typescript style
// lawer case a, b, c, d, e are generic types and F, G, H are generic type constructors
// it should handle nested functions and nested type constructors inside parens
// example:
// ```ts
// parseHaskellFn('a -> b -> c') // '<A1>(a1: A1) => <B1, B2>(b1: B1) => B2'
// parseHaskellFn('a -> b -> c', { a: 'string }) // '(a: string) => <A1, A2>(a1: A1) => A2'
// parseHaskellFn('a -> b -> c', { a: 'string', b: 'number' }) // '(a: string) => <A1>(b: number) => A1'
// parseHaskellFn('a -> b -> c',  { b: 'number' }) // '<A1>(a1: A1) => <B1>(b: number) => B1'
// parseHaskellFn('a -> b -> c',  { c: 'string' }) // '<A1>(a1: A1) => <B1>(b: B1) => string'
// parseHaskellFn('a -> (a -> b) -> b') // '<A1>(a1: A1) => <B1>(fab: (a: A1) => B1) => B1'
// parseHaskellFn('a -> F b ..α -> c', {F: 3}) // '<A1>(a1: A1) => <B1, B2, B3, B4>(fb: F<B1, B2, B3>) => B4'
// parseHaskellFn('a -> F (a -> b) ..α -> F b ..α', {F: 2}) // '<A1>(a1: A1) => <B1, B2, B3>(fb: F<(a1: A1) => B1, B2>) => F<B3, B2>'
// bimap: parseHaskellFn('(a -> b) -> F a c ..α -> F b c ..α', {F: 3}) // '<A1, A2>(f: (a: A1) => A2) => <B1, B2>(fa: F<A1, B1, B2>) => F<A2, B1, B2>'
// ap: parseHaskellFn('F a -> F (a -> b) ..α -> F b ..α', {F: 2}) // '<A1, A2>(fa: F<A1, A2>) => <B1>(fab: F<(a: A1) => B1, A2>) => F<B1, A2>'
// flapmap: parseHaskellFn('(a -> F b ..β) -> F a ..α -> F b ..αβ', {F: 3}) // '<A1, A2, A3, A4>(f: (a: A1) => F<A2, A3, A4>) => <B1, B2>(fa: F<A1, B1, B2>) => F<A2, A3|B1, A4|B2>'
// flatten: parseHaskellFn('F (F a ..α) ..β-> F a ..αβ', {F: 3}) // '<A1, A2, A3, A4, A5>(ffa: F<F<A1, A2, A3>, A4, A5>) => F<A1, A2 | A4, A3 | A5>'
// compose: parseHaskellFn('(a -> b) -> F (G a ..α) ..β -> F (G b ..α) ..β', {F: 2}) // '<A1, A2>(f: (a: A1) => A2) => <B1, B2>(fga: F<G<A1, B1>, B2>) => F<G<A2, B1>, B2>'
// ```

type TrimParens<T extends string> = T extends `(${infer U})` ? U : T;

function trimParens(input: string): string {
  if (input[0] !== '(' || input[input.length - 1] !== ')') return input;
  return input.slice(1, -1).trim();
}

type StringToTuple<T extends string, $acc extends unknown[] = []> = T extends `${infer A}${infer B}`
  ? StringToTuple<B, [...$acc, A]>
  : $acc;

type TrimLeft<T extends string> = T extends ` ${infer U}` ? TrimLeft<U> : T;
type TrimRight<T extends string> = T extends `${infer U} ` ? TrimRight<U> : T;
type Trim<T extends string> = TrimLeft<TrimRight<T>>;

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

type SplitFnWithParens<Input extends string> = SplitTupleFnWithParens<StringToTuple<Input>>;

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

type SplitParamWithParens<Input extends string> = SplitTupleParamWithParens<StringToTuple<Input>>;

function splitWithParens(input: string, split: string): string[] {
  let parentheses = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') parentheses++;
    else if (input[i] === ')') parentheses--;
    else if (parentheses === 0 && input.slice(i, i + split.length) === split) {
      return [input.slice(0, i).trim(), ...splitWithParens(input.slice(i + split.length), split)];
    }
  }
  return [input.trim()];
}

type UppercaseChars =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F'
  | 'G'
  | 'H'
  | 'I'
  | 'J'
  | 'K'
  | 'L'
  | 'M'
  | 'N'
  | 'O'
  | 'P'
  | 'Q'
  | 'R'
  | 'S'
  | 'T'
  | 'U'
  | 'W'
  | 'X'
  | 'Y'
  | 'Z';
type LowercaseChars =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'w'
  | 'x'
  | 'y'
  | 'z';
type GreekChars =
  | 'α'
  | 'β'
  | 'γ'
  | 'δ'
  | 'ε'
  | 'ζ'
  | 'η'
  | 'θ'
  | 'ι'
  | 'κ'
  | 'λ'
  | 'μ'
  | 'ν'
  | 'ξ'
  | 'ο'
  | 'π'
  | 'ρ'
  | 'σ'
  | 'τ'
  | 'υ'
  | 'φ'
  | 'χ'
  | 'ψ'
  | 'ω';

type DoubleGreekChars = `${GreekChars}${GreekChars}`;
type TypeContructorAST = {
  type: 'typeconstructor';
  name: UppercaseChars;
  params: HaskellAST[];
  spread?: GreekChars | DoubleGreekChars;
};

type TypeAST = {
  type: 'type';
  name: LowercaseChars;
};

type FunctionAST = {
  type: 'function';
  args: HaskellAST[];
  result: HaskellAST;
};

type ChainAST = {
  type: 'chain';
  args: HaskellAST[];
  result: HaskellAST;
};

type HaskellAST = FunctionAST | ChainAST | TypeAST | TypeContructorAST;

function parseTypeConstructorAST(type: string): HaskellAST {
  const [typeconstructor, ...params] = splitWithParens(type, ' ');
  const lastParam = params[params.length - 1];
  if (isSpreadName(lastParam)) {
    params.pop();
    return {
      type: 'typeconstructor',
      name: typeconstructor as UppercaseChars,
      params: params.map(arg => parseAST(trimParens(arg))),
      spread: lastParam.slice(2) as GreekChars,
    };
  }
  return {
    type: 'typeconstructor',
    name: typeconstructor as UppercaseChars,
    params: params.map(arg => parseAST(trimParens(arg))),
  };
}

function isTypeConstructor(char: string): char is UppercaseChars {
  return /[A-Z]/.test(char);
}

function isTypeName(char: string): char is LowercaseChars {
  return /[a-z]/.test(char);
}

function isSpreadName(param: string): param is `..${GreekChars}` | `..${GreekChars}${GreekChars}` {
  return param.startsWith('..');
}

function parseArgsAST(input: string): HaskellAST[] {
  if (isTypeConstructor(input[0])) return [parseTypeConstructorAST(input)];
  return splitWithParens(input, ' ').map(arg => parseAST(trimParens(arg)));
}

function parseFromArrayToManyAST([type, ...rest]: string[]): HaskellAST[] {
  if (rest.length === 0) {
    if (isTypeConstructor(type[0])) return [parseTypeConstructorAST(type)];
    if (type.length <= 1) return [{ type: 'type', name: type as LowercaseChars }];
    return parseArgsAST(type);
  }
  if (rest.length === 1) {
    return [
      {
        type: 'function',
        args: parseArgsAST(type),
        result: parseAST(trimParens(rest[0])),
      },
    ];
  }
  return [
    {
      type: 'chain',
      args: parseArgsAST(type),
      result: parseFromArrayToManyAST(rest)[0],
    },
  ];
}

function parseToManyAST(input: string): HaskellAST[] {
  return parseFromArrayToManyAST(splitWithParens(input, '->'));
}

function parseAST(input: string): HaskellAST {
  return parseToManyAST(input)[0];
}

type TypeMap = Record<string, string>;
type TypeConstructorMap = Record<string, number>;

// don't return duplicates
function getGenericTypeListAST(
  ast: HaskellAST,
  typeConstructorMap: TypeConstructorMap,
  typeMap: TypeMap,
  set = new Set<string>(),
): Set<string> {
  if (ast.type === 'typeconstructor') {
    for (const param of ast.params) {
      getGenericTypeListAST(param, typeConstructorMap, typeMap, set);
    }
    if (ast.name in typeConstructorMap && ast.spread && ast.spread.length === 1) {
      const spreadLength = typeConstructorMap[ast.name] - ast.params.length;
      for (let i = 0; i < spreadLength; i++) {
        const greek = `${ast.spread}${i}`;
        if (!(greek in typeMap)) set.add(greek);
      }
    }
  }
  if (ast.type === 'function' || ast.type === 'chain') {
    for (const arg of ast.args) {
      getGenericTypeListAST(arg, typeConstructorMap, typeMap, set);
    }
    getGenericTypeListAST(ast.result, typeConstructorMap, typeMap, set);
  }
  if (ast.type === 'type' && !(ast.name in typeMap) && !set.has(ast.name)) {
    set.add(ast.name);
  }
  return set;
}

function genGenericFunction(
  arity: number,
  buildTypeMap: (types: string[]) => Record<string, string>,
  buildTypeParams: (typeMap: Record<string, string>) => string[],
  buildTypeResult: (typeMap: Record<string, string>) => string,
  alpha: UppercaseChars = 'A',
): string {
  const types = Array.from({ length: arity }, (_, i) => `${alpha}${i + 1}`);
  const typeMap = buildTypeMap(types);
  const params = buildTypeParams(typeMap);
  // params to args, ie: ['typeA', 'typeB'] => ['arg0: typeA', 'arg1: typeB']
  const args = params.map((type, i) => `arg${i}: ${type}`);
  const result = buildTypeResult(typeMap);
  const genericPrefix = arity > 0 ? `<${types.join(', ')}>` : '';
  return `${genericPrefix}(${args.join(', ')}) => ${result}`;
}

const getNextAlpha = (alpha: UppercaseChars) => {
  const code = alpha.charCodeAt(0);
  return String.fromCharCode(code + 1) as UppercaseChars;
};

const getSpreadParams = (spread: GreekChars, typemap: TypeMap): string[] => {
  const types: string[] = [];
  for (const type in typemap) {
    if (type.startsWith(spread)) types.push(typemap[type]);
  }
  return types;
};

const mergeSpreadParams = (A: GreekChars, B: GreekChars, typemap: TypeMap) => {
  const spreadA = getSpreadParams(A, typemap);
  const spreadB = getSpreadParams(B, typemap);
  const types: string[] = [];
  const max = Math.max(spreadA.length, spreadB.length);
  for (let i = 0; i < max; i++) {
    types.push(`${spreadA[i]} | ${spreadB[i]}`);
  }
  return types;
};

const buildTypeContructor = (ast: TypeContructorAST, typeConstructorMap: TypeConstructorMap, typeMap: TypeMap) => {
  const params = ast.params.map(param => parseHaskellWithAST(param, typeConstructorMap, typeMap));
  if (!(ast.name in typeConstructorMap) || !ast.spread) return `${ast.name}<${params.join(', ')}>`;
  console.log('build type constructor', ast.name, ast.spread, params);
  if (ast.spread.length === 1)
    return `${ast.name}<${[...params, ...getSpreadParams(ast.spread as GreekChars, typeMap)].join(', ')}>`;

  return `${ast.name}<${[
    ...params,
    ...mergeSpreadParams(ast.spread[0] as GreekChars, ast.spread[1] as GreekChars, typeMap),
  ].join(', ')}>`;
};

const unique = <T>(arr: T[]) => [...new Set(arr)];

function parseHaskellWithAST(
  ast: HaskellAST,
  typeConstructorMap: TypeConstructorMap,
  typeMap: TypeMap,
  alpha: UppercaseChars = 'A',
): string {
  if (ast.type === 'typeconstructor') {
    return buildTypeContructor(ast, typeConstructorMap, typeMap);
  }
  if (ast.type === 'type') {
    return typeMap[ast.name];
  }
  if (ast.type === 'function' || ast.type === 'chain') {
    let genericLetters: string[];
    if (ast.type === 'function') {
      genericLetters = [...getGenericTypeListAST(ast, typeConstructorMap, typeMap)];
    } else {
      const genericArgs = ast.args.flatMap(arg => [...getGenericTypeListAST(arg, typeConstructorMap, typeMap)]);
      genericLetters = unique([...genericArgs]);
    }
    return genGenericFunction(
      genericLetters.length,
      types => genericLetters.reduce((typemap, letter, i) => ((typemap[letter] = types[i]), typemap), typeMap),
      typemap => ast.args.map(arg => parseHaskellWithAST(arg, typeConstructorMap, typemap)),
      typemap =>
        parseHaskellWithAST(
          ast.result,
          typeConstructorMap,
          typemap,
          genericLetters.length === 0 ? alpha : getNextAlpha(alpha),
        ),
      alpha,
    );
  }
  throw new Error('unknown ast type');
}

function parseHaskell(input: string, typeConstructorMap: TypeConstructorMap = {}, typeMap: TypeMap = {}) {
  const ast = parseAST(input);
  return parseHaskellWithAST(ast, typeConstructorMap, typeMap);
}

describe('genGenericFunction', () => {
  it("should split a function string into it's parts", () => {
    expect(splitWithParens('a', '->')).toEqual(['a']);
    expect(splitWithParens('a b', '->')).toEqual(['a b']);
    expect(splitWithParens('a -> b', '->')).toEqual(['a', 'b']);
    expect(splitWithParens('a -> b -> c', '->')).toEqual(['a', 'b', 'c']);
    expect(splitWithParens('a -> b -> (c -> d)', '->')).toEqual(['a', 'b', '(c -> d)']);
    expect(splitWithParens('a   ->   (b -> c)  -> d', '->')).toEqual(['a', '(b -> c)', 'd']);
    expect(splitWithParens('a -> (b -> c) -> (d -> e)', '->')).toEqual(['a', '(b -> c)', '(d -> e)']);
    expect(splitWithParens('a -> (b -> c) -> (d -> (e -> f))', '->')).toEqual(['a', '(b -> c)', '(d -> (e -> f))']);
    expect(splitWithParens('a -> (b -> c) -> (d -> (e -> f)) -> g', '->')).toEqual([
      'a',
      '(b -> c)',
      '(d -> (e -> f))',
      'g',
    ]);
    expect(splitWithParens('(a -> b) -> F (G a ..g) ..f -> F (G b ..g) ..f', '->')).toEqual([
      '(a -> b)',
      'F (G a ..g) ..f',
      'F (G b ..g) ..f',
    ]);
  });

  it('should split type list', () => {
    expect(splitWithParens('a b c', ' ')).toEqual(['a', 'b', 'c']);
    expect(splitWithParens('a (b -> c)', ' ')).toEqual(['a', '(b -> c)']);
    expect(splitWithParens('a (b -> c) d', ' ')).toEqual(['a', '(b -> c)', 'd']);
  });

  it('should generate an AST', () => {
    expect(parseAST('a')).toEqual({ type: 'type', name: 'a' });
    expect(parseAST('a b -> (c -> d)')).toEqual({
      type: 'function',
      args: [
        { type: 'type', name: 'a' },
        { type: 'type', name: 'b' },
      ],
      result: { type: 'function', args: [{ type: 'type', name: 'c' }], result: { type: 'type', name: 'd' } },
    });
    expect(parseAST('a b -> (c d -> e)')).toEqual({
      type: 'function',
      args: [
        { type: 'type', name: 'a' },
        { type: 'type', name: 'b' },
      ],
      result: {
        type: 'function',
        args: [
          { type: 'type', name: 'c' },
          { type: 'type', name: 'd' },
        ],
        result: { type: 'type', name: 'e' },
      },
    });
    expect(parseAST('a b -> c')).toEqual({
      type: 'function',
      args: [
        { type: 'type', name: 'a' },
        { type: 'type', name: 'b' },
      ],
      result: { type: 'type', name: 'c' },
    });
    expect(parseAST('a -> b -> c')).toEqual({
      type: 'chain',
      args: [{ type: 'type', name: 'a' }],
      result: {
        type: 'function',
        args: [{ type: 'type', name: 'b' }],
        result: { type: 'type', name: 'c' },
      },
    });
    expect(parseAST('a (b -> c) -> d')).toEqual({
      type: 'function',
      args: [
        { type: 'type', name: 'a' },
        { type: 'function', args: [{ type: 'type', name: 'b' }], result: { type: 'type', name: 'c' } },
      ],
      result: { type: 'type', name: 'd' },
    });

    expect(parseAST('a -> (a -> b) -> b')).toEqual({
      type: 'chain',
      args: [{ type: 'type', name: 'a' }],
      result: {
        type: 'function',
        args: [{ type: 'function', args: [{ type: 'type', name: 'a' }], result: { type: 'type', name: 'b' } }],
        result: { type: 'type', name: 'b' },
      },
    });
    expect(parseAST('(F a b -> b) -> a -> (c -> d)')).toEqual({
      type: 'chain',
      args: [
        {
          type: 'function',
          args: [
            {
              type: 'typeconstructor',
              name: 'F',
              params: [
                { type: 'type', name: 'a' },
                { type: 'type', name: 'b' },
              ],
            },
          ],
          result: { type: 'type', name: 'b' },
        },
      ],
      result: {
        type: 'function',
        args: [{ type: 'type', name: 'a' }],
        result: { type: 'function', args: [{ type: 'type', name: 'c' }], result: { type: 'type', name: 'd' } },
      },
    });
    expect(parseAST('(F a b -> b) -> a -> c -> d')).toEqual({
      type: 'chain',
      args: [
        {
          type: 'function',
          args: [
            {
              type: 'typeconstructor',
              name: 'F',
              params: [
                { type: 'type', name: 'a' },
                { type: 'type', name: 'b' },
              ],
            },
          ],
          result: { type: 'type', name: 'b' },
        },
      ],
      result: {
        type: 'chain',
        args: [{ type: 'type', name: 'a' }],
        result: { type: 'function', args: [{ type: 'type', name: 'c' }], result: { type: 'type', name: 'd' } },
      },
    });
    expect(parseAST('F (F a) -> F a')).toEqual({
      type: 'function',
      args: [
        {
          type: 'typeconstructor',
          name: 'F',
          params: [
            {
              type: 'typeconstructor',
              name: 'F',
              params: [{ type: 'type', name: 'a' }],
            },
          ],
        },
      ],
      result: {
        type: 'typeconstructor',
        name: 'F',
        params: [{ type: 'type', name: 'a' }],
      },
    });
    expect(parseAST('(a -> b) -> F (G a) -> F (G b)')).toEqual({
      type: 'chain',
      args: [
        {
          type: 'function',
          args: [{ type: 'type', name: 'a' }],
          result: { type: 'type', name: 'b' },
        },
      ],
      result: {
        type: 'function',
        args: [
          {
            type: 'typeconstructor',
            name: 'F',
            params: [
              {
                type: 'typeconstructor',
                name: 'G',
                params: [{ type: 'type', name: 'a' }],
              },
            ],
          },
        ],
        result: {
          type: 'typeconstructor',
          name: 'F',
          params: [
            {
              type: 'typeconstructor',
              name: 'G',
              params: [{ type: 'type', name: 'b' }],
            },
          ],
        },
      },
    });
    expect(parseAST('(a -> F b ..β) -> F a ..α -> F b ..αβ')).toEqual({
      type: 'chain',
      args: [
        {
          type: 'function',
          args: [{ type: 'type', name: 'a' }],
          result: { type: 'typeconstructor', name: 'F', params: [{ type: 'type', name: 'b' }], spread: 'β' },
        },
      ],
      result: {
        type: 'function',
        args: [{ type: 'typeconstructor', name: 'F', params: [{ type: 'type', name: 'a' }], spread: 'α' }],
        result: { type: 'typeconstructor', name: 'F', params: [{ type: 'type', name: 'b' }], spread: 'αβ' },
      },
    });
  });

  it('should generate a generic function with type params', () => {
    expect(parseHaskell('a b -> (c -> d)')).toEqual('<A1, A2, A3, A4>(arg0: A1, arg1: A2) => (arg0: A3) => A4');
    expect(parseHaskell('a -> b -> c')).toEqual('<A1>(arg0: A1) => <B1, B2>(arg0: B1) => B2');
    expect(parseHaskell('a -> b -> c', {}, { a: 'string' })).toEqual('(arg0: string) => <A1, A2>(arg0: A1) => A2');
    expect(parseHaskell('a -> b -> c', {}, { a: 'string', b: 'number' })).toEqual(
      '(arg0: string) => <A1>(arg0: number) => A1',
    );
    expect(parseHaskell('a -> b -> c', {}, { b: 'number' })).toEqual('<A1>(arg0: A1) => <B1>(arg0: number) => B1');
    expect(parseHaskell('a -> b -> c', {}, { c: 'string' })).toEqual('<A1>(arg0: A1) => <B1>(arg0: B1) => string');
    expect(parseHaskell('a -> (a -> b) -> b')).toEqual('<A1>(arg0: A1) => <B1>(arg0: (arg0: A1) => B1) => B1');
    expect(parseHaskell('a -> (a b -> c) -> d')).toEqual(
      '<A1>(arg0: A1) => <B1, B2, B3>(arg0: (arg0: A1, arg1: B1) => B2) => B3',
    );
    expect(parseHaskell('a -> (a -> b) -> (c -> d)')).toEqual(
      '<A1>(arg0: A1) => <B1, B2, B3>(arg0: (arg0: A1) => B1) => (arg0: B2) => B3',
    );
    expect(parseHaskell('(F a b -> b) -> a -> (c -> d)')).toEqual(
      '<A1, A2>(arg0: (arg0: F<A1, A2>) => A2) => <B1, B2>(arg0: A1) => (arg0: B1) => B2',
    );
    expect(parseHaskell('(a -> b) -> F a c -> F b c')).toEqual(
      '<A1, A2>(arg0: (arg0: A1) => A2) => <B1>(arg0: F<A1, B1>) => F<A2, B1>',
    );
    expect(parseHaskell('F a -> (a -> b) -> F b')).toEqual(
      '<A1>(arg0: F<A1>) => <B1>(arg0: (arg0: A1) => B1) => F<B1>',
    );
    expect(parseHaskell('F a -> F (a -> b) -> F b')).toEqual(
      '<A1>(arg0: F<A1>) => <B1>(arg0: F<(arg0: A1) => B1>) => F<B1>',
    );
    expect(parseHaskell('(a -> F b) -> F a -> F b')).toEqual(
      '<A1, A2>(arg0: (arg0: A1) => F<A2>) => (arg0: F<A1>) => F<A2>',
    );
    expect(parseHaskell('F (F a) -> F a')).toEqual('<A1>(arg0: F<F<A1>>) => F<A1>');
    expect(parseHaskell('F (F a ..α) ..β  -> F (F a ..α) ..β', { F: 2 })).toEqual(
      '<A1, A2, A3>(arg0: F<F<A1, A2>, A3>) => F<F<A1, A2>, A3>',
    );
    expect(parseHaskell('(a -> b) -> F (G a) -> F (G b)')).toEqual(
      '<A1, A2>(arg0: (arg0: A1) => A2) => (arg0: F<G<A1>>) => F<G<A2>>',
    );
    expect(parseHaskell('(a -> b) -> F (G a ..α) ..β -> F (G b ..α) ..β', { F: 2, G: 3 })).toEqual(
      '<A1, A2>(arg0: (arg0: A1) => A2) => <B1, B2, B3>(arg0: F<G<A1, B1, B2>, B3>) => F<G<A2, B1, B2>, B3>',
    );
    expect(parseHaskell('(a -> F b ..β) -> F a ..α -> F b ..αβ', { F: 3 })).toEqual(
      '<A1, A2, A3, A4>(arg0: (arg0: A1) => F<A2, A3, A4>) => <B1, B2>(arg0: F<A1, B1, B2>) => F<A2, B1 | A3, B2 | A4>',
    );
  });
});
