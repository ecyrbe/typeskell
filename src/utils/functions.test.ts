import { describe, expectTypeOf, expect, it } from 'vitest';

type toTuple<T, $acc extends unknown[] = []> = T extends `${infer Char}${infer Rest}`
  ? toTuple<Rest, [...$acc, Char]>
  : $acc;
type Test = toTuple<'a(b(c)) -> d -> (a -> b)'>;

class Either<E, A> {
  flatmap<E1, A1, E1contraint = E extends E1 ? E1 : never>(f: (a: A) => Either<E1, A1>): Either<E1contraint, A1> {
    return null as any;
  }
  flatMap2<E1, A1>(f: (a: A) => Either<E1, A1>): Either<E1 | E, A1> {
    return null as any;
  }
}

const test = new Either<string, number>();
const test2 = test.flatmap(x => new Either<Error, string>());

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
// parseHaskellFn('a -> F1 b -> c', {F: 3}) // '<A1>(a1: A1) => <B1, B2, B3, B4>(fb: F<B1, B2, B3>) => B4'
// parseHaskellFn('a -> F1 (a -> b) -> F1 b', {F: 2}) // '<A1>(a1: A1) => <B1, B2, B3>(fb: F<(a1: A1) => B1, B2>) => F<B3, B2>'
// parseHaskellFn('a -> F1 (a -> b) -> G1 b', {F: 3, G: 3}) // '<A1>(a1: A1) => <B1, B2, B3>(fb: F<(a1: A1) => B1, B2, B3>) => G<B1, B2, B3>'
// bimap: parseHaskellFn('(a -> b) -> F1 a c -> F1 b c', {F: 3}) // '<A1, A2>(f: (a: A1) => A2) => <B1, B2>(fa: F<A1, B1, B2>) => F<A2, B1, B2>'
// ap: parseHaskellFn('F1 a -> F2 (a -> b) -> F12 b', {F: 2}) // '<A1, A2>(fa: F<A1, A2>) => <B1>(fab: F<(a: A1) => B1, A2>) => F<B1, A2>'
// flapmap: parseHaskellFn('(a -> F1 b) -> F2 a -> F12 b', {F: 3}) // '<A1, A2, A3, A4>(f: (a: A1) => F<A2, A3, A4>) => <B1, B2>(fa: F<A1, B1, B2>) => F<A2, A3|B1, A4|B2>'
// flatten: parseHaskellFn('F1 (F2 a) -> F12 a', {F: 3}) // '<A1, A2, A3, A4, A5>(ffa: F<F<A1, A2, A3>, A4, A5>) => F<A1, A2 | A4, A3 | A5>'
// compose: parseHaskellFn('(a -> b) -> F1 (G1 a) Fa -> F1 (G1 b)', {F: 2}) // '<A1, A2>(f: (a: A1) => A2) => <B1, B2>(fga: F<G<A1, B1>, B2>) => F<G<A2, B1>, B2>'
// ```
function splitFunctionString(input: string): string[] {
  let parentheses = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '(') parentheses++;
    else if (input[i] === ')') parentheses--;
    else if (input.slice(i, i + 4) === ' -> ' && parentheses === 0) {
      return [input.slice(0, i).trim(), ...splitFunctionString(input.slice(i + 4))];
    }
  }
  return [input.trim()];
}

// genGenericFunction(2, gen => gen, gen => gen[0], 'A') // output: <A1, A2>(a1: A1, a2: A2) => A1
function genGenericFunction(
  arity: number,
  buildTypeParams: (gen: string[]) => string[],
  buildTypeResult: (gen: string[]) => string,
  alpha: 'A' | 'B' | 'C' | 'D' = 'A',
): string {
  const types = Array.from({ length: arity }, (_, i) => `${alpha}${i + 1}`);
  const params = buildTypeParams(types);
  // params to args, ie: ['typeA', 'typeB'] => ['arg0: typeA', 'arg1: typeB']
  const args = params.map((type, i) => `arg${i}: ${type}`);
  const result = buildTypeResult(types);
  const genericPrefix = arity > 0 ? `<${types.join(', ')}>` : '';
  return `${genericPrefix}(${args.join(', ')}) => ${result}`;
}

function parseHaskellFn(input: string, typeMap: Record<string, string | number> = {}, genericPrefix = false): string {
  const types = splitFunctionString(input);
  //merge the last to types if they are at least two types to merge
  if (types.length > 1) {
    const lastType = types.pop()!;
    const secondLastType = types.pop()!;
    types.push(`${secondLastType} -> ${lastType}`);
  }
  // extract all single lowercase letter types from types, ie: '(a -> F b)' => ['a', 'b']
  const typeLetters = types
    .map(type => type.match(/([a-z])/g))
    .filter((type): type is RegExpMatchArray => type !== null)
    .flat();

  const typeParams = types.map(type => {
    if (type in typeMap) return typeMap[type];
    if (type[0] === '(') return parseHaskellFn(type.slice(1, -1), typeMap);
    return 'A';
  });
  const typeResult = typeParams.pop()!;
  return genGenericFunction(
    types.length - 1,
    gen => gen,
    gen => gen[0],
    typeResult as 'A' | 'B' | 'C' | 'D',
  );
}

describe('genGenericFunction', () => {
  it("should split a function string into it's parts", () => {
    expect(splitFunctionString('a -> b -> c')).toEqual(['a', 'b', 'c']);
    expect(splitFunctionString('a -> b -> (c -> d)')).toEqual(['a', 'b', '(c -> d)']);
    expect(splitFunctionString('a   ->   (b -> c)  -> d')).toEqual(['a', '(b -> c)', 'd']);
    expect(splitFunctionString('a -> (b -> c) -> (d -> e)')).toEqual(['a', '(b -> c)', '(d -> e)']);
    expect(splitFunctionString('a -> (b -> c) -> (d -> (e -> f))')).toEqual(['a', '(b -> c)', '(d -> (e -> f))']);
    expect(splitFunctionString('a -> (b -> c) -> (d -> (e -> f)) -> g')).toEqual([
      'a',
      '(b -> c)',
      '(d -> (e -> f))',
      'g',
    ]);
    expect(splitFunctionString('(a -> b) -> F (G a ..g) ..f -> F (G b ..g) ..f')).toEqual([
      '(a -> b)',
      'F (G a ..g) ..f',
      'F (G b ..g) ..f',
    ]);
  });
  it('should generate a generic function', () => {
    expect(
      genGenericFunction(
        0,
        () => ['A'],
        () => 'B',
      ),
    ).toEqual('(arg0: A) => B');
    expect(
      genGenericFunction(
        2,
        gen => gen,
        gen => gen[0],
      ),
    ).toEqual('<A1, A2>(arg0: A1, arg1: A2) => A1');
    expect(
      genGenericFunction(
        2,
        args1 => args1,
        args1 =>
          genGenericFunction(
            1,
            args2 => [...args1, ...args2],
            args2 => args1[0],
            'B',
          ),
      ),
    ).toEqual('<A1, A2>(arg0: A1, arg1: A2) => <B1>(arg0: A1, arg1: A2, arg2: B1) => A1');
  });

  it('should generate a generic function with type params', () => {
    expect(parseHaskellFn('a -> b -> c')).toEqual('<A1>(arg0: A1) => <B1, B2>(arg0: B1) => B2');
  });
});
