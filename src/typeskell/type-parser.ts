import type { TypeContructorASTCompiler, ChainASTCompiler, FunctionASTCompiler, TypeASTCompiler } from './ast/types';
import type { TypeConstructorMapCompiler, TypeList, TypeNameList } from './types';
import { ZipWithVariance } from '@kinds/variance';
import { StringToTuple, Range, Flatten, Drop } from '@utils/tuples';
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

type GetFromList<key, typeNameList extends TypeNameList, typeList> = typeNameList extends [
  ...infer Rest extends TypeNameList,
  infer Last,
]
  ? Last extends key
    ? typeList extends TypeList
      ? typeList[Rest['length']]
      : never
    : GetFromList<key, Rest, typeList>
  : never;

type MapSpreadParams<Spreads, typeNameList extends TypeNameList, typeList> = {
  [K in keyof Spreads]: GetFromList<Spreads[K], typeNameList, typeList>;
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
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
  typeList,
> = MapSpreadParams<BuildSpreadParams<spread, ast, typeconstructorMap>, typeNameList, typeList>;

export type MergeSpreadParams<
  ast extends TypeContructorASTCompiler,
  A extends string,
  B extends string,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
  typeList,
  $spreadA = GetSpreadParams<A, ast, typeconstructorMap, typeNameList, typeList>,
  $spreadB = GetSpreadParams<B, ast, typeconstructorMap, typeNameList, typeList>,
> = ZipWithVariance<$spreadA, $spreadB, Drop<ast['params']['length'], typeconstructorMap[ast['name']]['signature']>>;

type MapSpread<T extends number[], Spread extends string> = {
  [K in keyof T]: `${Spread}${T[K]}`;
};

export type BuildGenericSpreadKeys<
  ast extends TypeContructorASTCompiler,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
> = ast['name'] extends keyof typeconstructorMap
  ? ast['spread'] extends infer spread extends string
    ? StringToTuple<spread>['length'] extends 1
      ? `${spread}0` extends typeNameList[number]
        ? []
        : Sub<typeconstructorMap[ast['name']]['arity'], ast['params']['length']> extends infer spreadLength extends
              number
          ? MapSpread<Range<spreadLength>, spread>
          : []
      : []
    : []
  : [];

type MapGetGenericKeys<T, typeconstructorMap extends TypeConstructorMapCompiler, typeNameList extends TypeNameList> = {
  [K in keyof T]: GetGenericKeys<T[K], typeconstructorMap, typeNameList>;
};

type GetGenericKeys<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
> = ast extends TypeContructorASTCompiler
  ? [
      ...Flatten<MapGetGenericKeys<ast['params'], typeconstructorMap, typeNameList>>,
      ...BuildGenericSpreadKeys<ast, typeconstructorMap, typeNameList>,
    ]
  : ast extends ChainASTCompiler
    ? Flatten<MapGetGenericKeys<ast['args'], typeconstructorMap, typeNameList>>
    : ast extends FunctionASTCompiler
      ? Flatten<MapGetGenericKeys<[...ast['args'], ast['result']], typeconstructorMap, typeNameList>>
      : ast extends TypeASTCompiler
        ? ast['name'] extends typeNameList[number]
          ? []
          : [ast['name']]
        : [];

export type BuildSpreadKeys<
  ast extends TypeContructorASTCompiler,
  typeconstructorMap extends TypeConstructorMapCompiler,
> = ast['name'] extends keyof typeconstructorMap
  ? ast['spread'] extends infer spread extends string
    ? StringToTuple<spread>['length'] extends 1
      ? Sub<typeconstructorMap[ast['name']]['arity'], ast['params']['length']> extends infer spreadLength extends number
        ? MapSpread<Range<spreadLength>, spread>
        : []
      : []
    : []
  : [];

type MapKeys<T, typeconstructorMap extends TypeConstructorMapCompiler> = {
  [K in keyof T]: GetKeys<T[K], typeconstructorMap>;
};

export type GetKeys<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  type extends 'both' | 'args' | 'result' = 'both',
> = ast extends TypeContructorASTCompiler
  ? [...Flatten<MapKeys<ast['params'], typeconstructorMap>>, ...BuildSpreadKeys<ast, typeconstructorMap>]
  : ast extends ChainASTCompiler
    ? Flatten<MapKeys<ast['args'], typeconstructorMap>>
    : ast extends FunctionASTCompiler
      ? type extends 'both'
        ? Flatten<MapKeys<[...ast['args'], ast['result']], typeconstructorMap>>
        : type extends 'args'
          ? Flatten<MapKeys<ast['args'], typeconstructorMap>>
          : GetKeys<ast['result'], typeconstructorMap>
      : ast extends TypeASTCompiler
        ? [ast['name']]
        : [];

type Unique<T, $map = never, $acc extends unknown[] = []> = T extends [infer Head, ...infer Tail]
  ? Head extends $map
    ? Unique<Tail, $map, $acc>
    : Unique<Tail, $map | Head, [...$acc, Head]>
  : $acc;

export type BuildGenericKeys<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
> = Unique<GetGenericKeys<ast, typeconstructorMap, typeNameList>>;

export type BuildKeys<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  type extends 'both' | 'args' | 'result' = 'both',
> = Unique<GetKeys<ast, typeconstructorMap, type>>;

type MapTypeskell<
  params,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
  typeList,
> = {
  [K in keyof params]: ParseTypeskell<params[K], typeconstructorMap, typeNameList, typeList>;
};

export type BuildTypeContructor<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
  typeList,
> = ast extends TypeContructorASTCompiler
  ? MapTypeskell<ast['params'], typeconstructorMap, typeNameList, typeList> extends infer params extends TypeNameList
    ? ast['name'] extends keyof typeconstructorMap
      ? ast['spread'] extends string
        ? StringToTuple<ast['spread']> extends [infer spreadA extends string, infer spreadB extends string]
          ? $<
              typeconstructorMap[ast['name']],
              [...params, ...MergeSpreadParams<ast, spreadA, spreadB, typeconstructorMap, typeNameList, typeList>]
            >
          : GetSpreadParams<
                ast['spread'],
                ast,
                typeconstructorMap,
                typeNameList,
                typeList
              > extends infer SpreadParams extends TypeNameList
            ? $<typeconstructorMap[ast['name']], [...params, ...SpreadParams]>
            : never
        : $<typeconstructorMap[ast['name']], params>
      : never
    : never
  : never;

type Filter<
  Keys,
  typeNameList extends TypeNameList,
  typeList,
  $accKeys extends TypeNameList = [],
  $accTypes extends TypeList = [],
> = Keys extends [infer H, ...infer R extends TypeNameList]
  ? H extends typeNameList[number]
    ? Filter<R, typeNameList, typeList, [...$accKeys, H], [...$accTypes, GetFromList<H, typeNameList, typeList>]>
    : Filter<R, typeNameList, typeList, $accKeys, $accTypes>
  : [$accKeys, $accTypes];

type MapKeysToFn<
  ast extends FunctionASTCompiler | ChainASTCompiler,
  generickeys extends TypeNameList,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
  typeList,
  alpha extends string,
  $argKeys extends TypeNameList = BuildKeys<ast, typeconstructorMap, 'args'>,
  $filteredArgKeysAndTypes extends [TypeNameList, TypeList] = Filter<$argKeys, typeNameList, typeList>,
> = GenericFn<
  generickeys['length'],
  BuildTypeskellParams<
    ast['args'],
    generickeys,
    typeconstructorMap,
    $filteredArgKeysAndTypes[0],
    $filteredArgKeysAndTypes[1]
  >,
  BuildTypeskellResult<
    ast['result'],
    generickeys,
    typeconstructorMap,
    typeNameList,
    typeList,
    generickeys['length'] extends 0 ? alpha : GetNextAlpha<alpha>
  >,
  alpha
>;

type ParseTypeskell<
  ast,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
  typeList,
  alpha extends string = 'A',
> = ast extends TypeContructorASTCompiler
  ? BuildTypeContructor<ast, typeconstructorMap, typeNameList, typeList>
  : ast extends TypeASTCompiler
    ? GetFromList<ast['name'], typeNameList, typeList>
    : ast extends FunctionASTCompiler | ChainASTCompiler
      ? BuildGenericKeys<ast, typeconstructorMap, typeNameList> extends infer generickeys extends TypeNameList
        ? MapKeysToFn<ast, generickeys, typeconstructorMap, typeNameList, typeList, alpha>
        : never
      : never;

interface BuildTypeskellParams<
  args,
  mapKeys extends TypeNameList,
  typeConstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
  typeList,
> extends Kind {
  return: this['rawArgs'] extends TypeList
    ? typeList extends TypeList
      ? MapTypeskell<args, typeConstructorMap, [...typeNameList, ...mapKeys], [...typeList, ...this['rawArgs']]>
      : never
    : never;
}

interface BuildTypeskellResult<
  ast,
  mapKeys extends TypeNameList,
  typeconstructorMap extends TypeConstructorMapCompiler,
  typeNameList extends TypeNameList,
  typeList,
  alpha extends string,
> extends Kind {
  return: this['rawArgs'] extends TypeList
    ? typeList extends TypeList
      ? ParseTypeskell<ast, typeconstructorMap, [...typeNameList, ...mapKeys], [...typeList, ...this['rawArgs']], alpha>
      : never
    : never;
}

export type TypeSkell<
  Input extends string,
  typeconstructorMap extends TypeConstructorMapCompiler = {},
  typeNameList extends TypeNameList = [],
  typeList extends unknown[] = [],
> = ParseTypeskell<
  ParseAST<Input>,
  typeconstructorMap,
  ['boolean', 'number', 'string', ...typeNameList],
  [boolean, number, string, ...typeList]
>;
