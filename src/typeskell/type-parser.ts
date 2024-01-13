import type { TypeContructorASTCompiler, ChainASTCompiler, FunctionASTCompiler, TypeASTCompiler } from './ast/types';
import type { TypeConstructorMapCompiler, TypeMapCompiler } from './types';
import { ZipWithVariance } from '@kinds/variance';
import { StringToTuple, Range, Flatten, Drop, Zip } from '@utils/tuples';
import { Sub } from '@utils/numbers';
import { Kind, $ } from '@kinds';
import { GenericFn } from '@utils/functions';
import { ParseAST } from './ast/type-parser';

type NextAlphaMap = {
  A: 'B';
  B: 'C';
  C: 'D';
  D: 'E';
  E: 'F';
  F: 'G';
  G: 'H';
  H: 'I';
  I: 'J';
  J: 'K';
  K: 'L';
  L: 'M';
  M: 'N';
  N: 'O';
  O: 'P';
  P: 'Q';
  Q: 'R';
  R: 'S';
  S: 'T';
  T: 'U';
  U: 'V';
  V: 'W';
  W: 'X';
  X: 'Y';
  Y: 'Z';
  Z: 'A';
};

export type GetNextAlpha<alpha> = alpha extends keyof NextAlphaMap ? NextAlphaMap[alpha] : never;

type MapSpreadParams<Spreads, typeMap extends TypeMapCompiler> = {
  [K in keyof Spreads]: Spreads[K] extends keyof typeMap ? typeMap[Spreads[K]] : never;
};

export type BuildSpreadParams<
  spread extends string,
  ast extends TypeContructorASTCompiler,
  typeconstructorMap extends TypeConstructorMapCompiler,
> = ast['name'] extends keyof typeconstructorMap
  ? Sub<typeconstructorMap[ast['name']]['arity'], ast['params']['length']> extends infer spreadLength extends number
    ? MapSpread<Range<spreadLength>, spread>
    : []
  : [];

export type GetSpreadParams<
  spread extends string,
  ast extends TypeContructorASTCompiler,
  typeMap extends TypeMapCompiler,
  typeconstructorMap extends TypeConstructorMapCompiler,
> = MapSpreadParams<BuildSpreadParams<spread, ast, typeconstructorMap>, typeMap>;

export type MergeSpreadParams<
  ast extends TypeContructorASTCompiler,
  A extends string,
  B extends string,
  typemap extends TypeMapCompiler,
  typeconstructorMap extends TypeConstructorMapCompiler,
  $spreadA = GetSpreadParams<A, ast, typemap, typeconstructorMap>,
  $spreadB = GetSpreadParams<B, ast, typemap, typeconstructorMap>,
> = ZipWithVariance<$spreadA, $spreadB, Drop<ast['params']['length'], typeconstructorMap[ast['name']]['signature']>>;

type MapSpread<T extends number[], Spread extends string> = {
  [K in keyof T]: `${Spread}${T[K]}`;
};

export type BuildSpreadTypes<
  ast extends TypeContructorASTCompiler,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeMap extends TypeMapCompiler,
> = ast['name'] extends keyof typeconstructorMap
  ? ast['spread'] extends infer spread extends string
    ? StringToTuple<spread>['length'] extends 1
      ? `${spread}0` extends keyof typeMap
        ? []
        : Sub<typeconstructorMap[ast['name']]['arity'], ast['params']['length']> extends infer spreadLength extends
              number
          ? MapSpread<Range<spreadLength>, spread>
          : []
      : []
    : []
  : [];

type MapGetGenericTypeListAST<
  T,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeMap extends TypeMapCompiler,
> = {
  [K in keyof T]: GetGenericTypeListAST<T[K], typeconstructorMap, typeMap>;
};

type GetGenericTypeListAST<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeMap extends TypeMapCompiler,
> = ast extends TypeContructorASTCompiler
  ? [
      ...Flatten<MapGetGenericTypeListAST<ast['params'], typeconstructorMap, typeMap>>,
      ...BuildSpreadTypes<ast, typeconstructorMap, typeMap>,
    ]
  : ast extends ChainASTCompiler
    ? Flatten<MapGetGenericTypeListAST<ast['args'], typeconstructorMap, typeMap>>
    : ast extends FunctionASTCompiler
      ? Flatten<MapGetGenericTypeListAST<[...ast['args'], ast['result']], typeconstructorMap, typeMap>>
      : ast extends TypeASTCompiler
        ? ast['name'] extends keyof typeMap
          ? []
          : [ast['name']]
        : [];

type Unique<T, $map = never, $acc extends unknown[] = []> = T extends [infer Head, ...infer Tail]
  ? Head extends $map
    ? Unique<Tail, $map, $acc>
    : Unique<Tail, $map | Head, [...$acc, Head]>
  : $acc;

export type BuildKeys<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeMap extends TypeMapCompiler,
> = Unique<GetGenericTypeListAST<ast, typeconstructorMap, typeMap>>;

type MapTypeskell<params, typeconstructorMap extends TypeConstructorMapCompiler, typeMap extends TypeMapCompiler> = {
  [K in keyof params]: ParseTypeskell<params[K], typeconstructorMap, typeMap>;
};

export type BuildTypeContructor<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeMap extends TypeMapCompiler,
> = ast extends TypeContructorASTCompiler
  ? MapTypeskell<ast['params'], typeconstructorMap, typeMap> extends infer params extends unknown[]
    ? ast['name'] extends keyof typeconstructorMap
      ? ast['spread'] extends string
        ? StringToTuple<ast['spread']> extends [infer spreadA extends string, infer spreadB extends string]
          ? $<
              typeconstructorMap[ast['name']],
              [...params, ...MergeSpreadParams<ast, spreadA, spreadB, typeMap, typeconstructorMap>]
            >
          : GetSpreadParams<ast['spread'], ast, typeMap, typeconstructorMap> extends infer SpreadParams extends
                unknown[]
            ? $<typeconstructorMap[ast['name']], [...params, ...SpreadParams]>
            : never
        : $<typeconstructorMap[ast['name']], params>
      : never
    : never
  : never;

type ParseTypeskell<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeMap extends TypeMapCompiler,
  alpha extends string = 'A',
> = ast extends TypeContructorASTCompiler
  ? BuildTypeContructor<ast, typeconstructorMap, typeMap>
  : ast extends TypeASTCompiler
    ? typeMap[ast['name']]
    : ast extends FunctionASTCompiler | ChainASTCompiler
      ? BuildKeys<ast, typeconstructorMap, typeMap> extends infer keys extends string[]
        ? GenericFn<
            keys['length'],
            BuildTypeskellParams<ast['args'], keys, typeMap, typeconstructorMap>,
            BuildTypeskellResult<
              ast['result'],
              keys,
              typeMap,
              typeconstructorMap,
              keys['length'] extends 0 ? alpha : GetNextAlpha<alpha>
            >,
            alpha
          >
        : never
      : never;

type ZipToMap<T extends [string, unknown][]> = {
  [K in T[number] as K[0]]: K[1];
};

type BuildTypeMap<
  mapKeys extends string[],
  generics extends unknown[],
  typeMap extends TypeMapCompiler,
> = mapKeys['length'] extends 0
  ? typeMap
  : Zip<mapKeys, generics> extends infer zip extends [string, unknown][]
    ? ZipToMap<zip> & typeMap
    : typeMap;

interface BuildTypeskellParams<
  args,
  mapKeys extends string[],
  typeMap extends TypeMapCompiler,
  typeConstructorMap extends TypeConstructorMapCompiler,
> extends Kind {
  return: this['rawArgs'] extends unknown[]
    ? MapTypeskell<args, typeConstructorMap, BuildTypeMap<mapKeys, this['rawArgs'], typeMap>>
    : never;
}

interface BuildTypeskellResult<
  ast,
  mapKeys extends string[],
  typeMap extends TypeMapCompiler,
  typeconstructorMap extends TypeConstructorMapCompiler,
  alpha extends string,
> extends Kind {
  return: this['rawArgs'] extends unknown[]
    ? ParseTypeskell<ast, typeconstructorMap, BuildTypeMap<mapKeys, this['rawArgs'], typeMap>, alpha>
    : never;
}

export type TypeSkell<
  Input extends string,
  typeconstructorMap extends TypeConstructorMapCompiler = {},
  typeMap extends TypeMapCompiler = {},
> = ParseTypeskell<ParseAST<Input>, typeconstructorMap, typeMap>;
