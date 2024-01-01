/**
 * In/Out parameter
 */
export type Invariant<T> = (_: T) => T;
/**
 * Out parameter
 */
export type Covariant<T> = (_: never) => T;

/**
 * In parameter
 */
export type Contravariant<T> = (_: T) => void;

/**
 * In/Out parameter
 */
export type InvariantParam<T = unknown> = {
  type: 'invariant';
  value: T;
};

/**
 * Out parameter
 */
export type CovariantParam<T = unknown> = {
  type: 'covariant';
  value: T;
};

/**
 * In parameter
 */
export type ContravariantParam<T = unknown> = {
  type: 'contravariant';
  value: T;
};

export type UnknownParam = {
  type: unknown;
  value: unknown;
};

export type Param = InvariantParam | CovariantParam | ContravariantParam | UnknownParam;

export type VarianceParamOf<T extends Param[], N extends number> = T[N]['type'];

export type VarianceOf<
  T extends Param[],
  N extends number,
  Value,
  $variance = VarianceParamOf<T, N>,
> = $variance extends 'invariant'
  ? Invariant<Value>
  : $variance extends 'covariant'
    ? Covariant<Value>
    : $variance extends 'contravariant'
      ? Contravariant<Value>
      : never;

export type ZipWithVariance<
  A,
  B,
  Params extends Param[],
  $acc extends unknown[] = [],
  $index extends number = $acc['length'],
> = A extends [infer AHead, ...infer ATail]
  ? B extends [infer BHead, ...infer BTail]
    ? ZipWithVariance<
        ATail,
        BTail,
        Params,
        [...$acc, VarianceParamOf<Params, $index> extends 'contravariant' ? AHead & BHead : AHead | BHead]
      >
    : ZipWithVariance<ATail, [], Params, [...$acc, AHead]>
  : B extends [infer BHead, ...infer BTail]
    ? ZipWithVariance<[], BTail, Params, [...$acc, BHead]>
    : $acc;
