import { type Tuple } from "@utils/tuples";

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
  type: "invariant";
  value: T;
};

/**
 * Out parameter
 */
export type CovariantParam<T = unknown> = {
  type: "covariant";
  value: T;
};

/**
 * In parameter
 */
export type ContravariantParam<T = unknown> = {
  type: "contravariant";
  value: T;
};

export type UnknownParam = {
  type: unknown;
  value: unknown;
};

export type Param =
  | InvariantParam
  | CovariantParam
  | ContravariantParam
  | UnknownParam;

export type Variance<
  Invariant extends number = 0,
  Covariant extends number = 0,
  Contravariant extends number = 0,
> = [
  ...Tuple<InvariantParam, Invariant>,
  ...Tuple<CovariantParam, Covariant>,
  ...Tuple<ContravariantParam, Contravariant>,
];
