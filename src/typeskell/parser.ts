import type { TypeskellAST, TypeContructorAST, UppercaseChars, GreekChars } from './ast/types';
import { parseAST } from './ast/parser';
import type { TypeConstructorMap, TypeMap } from './types';

// don't return duplicates
function getGenericTypeListAST(ast: TypeskellAST, typeConstructorMap: TypeConstructorMap, typeMap: TypeMap): string[] {
  if (ast.type === 'typeconstructor') {
    return [
      ...ast.params.flatMap(param => getGenericTypeListAST(param, typeConstructorMap, typeMap)),
      ...buildSpreadTypes(ast, typeConstructorMap, typeMap),
    ];
  }
  if (ast.type === 'chain') {
    return ast.args.flatMap(arg => getGenericTypeListAST(arg, typeConstructorMap, typeMap));
  }
  if (ast.type === 'function') {
    return [...ast.args, ast.result].flatMap(arg => getGenericTypeListAST(arg, typeConstructorMap, typeMap));
  }
  if (ast.type === 'type' && !(ast.name in typeMap)) {
    return [ast.name];
  }
  return [];
}

const unique = <T>(arr: T[]) => [...new Set(arr)];

function buildSpreadTypes(ast: TypeContructorAST, typeConstructorMap: TypeConstructorMap, typeMap: TypeMap) {
  const tuple: string[] = [];
  if (ast.name in typeConstructorMap && ast.spread && ast.spread.length === 1 && !(`${ast.spread}0` in typeMap)) {
    const spreadLength = typeConstructorMap[ast.name] - ast.params.length;
    for (let i = 0; i < spreadLength; i++) {
      const greek = `${ast.spread}${i}`;
      tuple.push(greek);
    }
  }
  return tuple;
}

function buildGenericTypeList(ast: TypeskellAST, typeConstructorMap: TypeConstructorMap, typeMap: TypeMap): string[] {
  return unique(getGenericTypeListAST(ast, typeConstructorMap, typeMap));
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
  const params = ast.params.map(param => parseTypeskell(param, typeConstructorMap, typeMap));
  if (!(ast.name in typeConstructorMap) || !ast.spread) return `${ast.name}<${params.join(', ')}>`;
  if (ast.spread.length === 1)
    return `${ast.name}<${[...params, ...getSpreadParams(ast.spread as GreekChars, typeMap)].join(', ')}>`;

  return `${ast.name}<${[
    ...params,
    ...mergeSpreadParams(ast.spread[0] as GreekChars, ast.spread[1] as GreekChars, typeMap),
  ].join(', ')}>`;
};

function parseTypeskell(
  ast: TypeskellAST,
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
    const genericLetters = buildGenericTypeList(ast, typeConstructorMap, typeMap);
    return genGenericFunction(
      genericLetters.length,
      types => genericLetters.reduce((typemap, letter, i) => ((typemap[letter] = types[i]), typemap), typeMap),
      typemap => ast.args.map(arg => parseTypeskell(arg, typeConstructorMap, typemap)),
      typemap =>
        parseTypeskell(
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

// parse a function in haskell style and generate a generic function in typescript style
// lawer case a, b, c, d, e are generic types and F, G, H are generic type constructors
// it should handle nested functions and nested type constructors inside parens
// example:
// ```ts
// typeskell('a -> b -> c') // '<A1>(a1: A1) => <B1, B2>(b1: B1) => B2'
// typeskell('a -> b -> c', { a: 'string }) // '(a: string) => <A1, A2>(a1: A1) => A2'
// typeskell('a -> b -> c', { a: 'string', b: 'number' }) // '(a: string) => <A1>(b: number) => A1'
// typeskell('a -> b -> c',  { b: 'number' }) // '<A1>(a1: A1) => <B1>(b: number) => B1'
// typeskell('a -> b -> c',  { c: 'string' }) // '<A1>(a1: A1) => <B1>(b: B1) => string'
// typeskell('a -> (a -> b) -> b') // '<A1>(a1: A1) => <B1>(fab: (a: A1) => B1) => B1'
// typeskell('a -> F b ..α -> c', {F: 3}) // '<A1>(a1: A1) => <B1, B2, B3, B4>(fb: F<B1, B2, B3>) => B4'
// typeskell('a -> F (a -> b) ..α -> F b ..α', {F: 2}) // '<A1>(a1: A1) => <B1, B2, B3>(fb: F<(a1: A1) => B1, B2>) => F<B3, B2>'
// bimap: typeskell('(a -> b) -> F a c ..α -> F b c ..α', {F: 3}) // '<A1, A2>(f: (a: A1) => A2) => <B1, B2>(fa: F<A1, B1, B2>) => F<A2, B1, B2>'
// ap: typeskell('F a -> F (a -> b) ..α -> F b ..α', {F: 2}) // '<A1, A2>(fa: F<A1, A2>) => <B1>(fab: F<(a: A1) => B1, A2>) => F<B1, A2>'
// flapmap: typeskell('(a -> F b ..β) -> F a ..α -> F b ..αβ', {F: 3}) // '<A1, A2, A3, A4>(f: (a: A1) => F<A2, A3, A4>) => <B1, B2>(fa: F<A1, B1, B2>) => F<A2, A3|B1, A4|B2>'
// flatten: typeskell('F (F a ..α) ..β-> F a ..αβ', {F: 3}) // '<A1, A2, A3, A4, A5>(ffa: F<F<A1, A2, A3>, A4, A5>) => F<A1, A2 | A4, A3 | A5>'
// compose: typeskell('(a -> b) -> F (G a ..α) ..β -> F (G b ..α) ..β', {F: 2}) // '<A1, A2>(f: (a: A1) => A2) => <B1, B2>(fga: F<G<A1, B1>, B2>) => F<G<A2, B1>, B2>'
// ```
export function typeskell(input: string, typeConstructorMap: TypeConstructorMap = {}, typeMap: TypeMap = {}) {
  const ast = parseAST(input);
  return parseTypeskell(ast, typeConstructorMap, typeMap);
}
