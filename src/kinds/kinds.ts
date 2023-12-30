import { CovariantParam, InvariantParam, Param } from "./variance";

export interface Kind<params extends Param[] = Param[]> {
  signature: params; // keep track of variance signature
  rawArgs: unknown;
  arity: params["length"];
  // arguments in signature are defined with the given variance contraint
  arg0: params[0]["value"];
  arg1: params[1]["value"];
  arg2: params[2]["value"];
  arg3: params[3]["value"];
  arg4: params[4]["value"];
  arg5: params[5]["value"];
  arg6: params[6]["value"];
  arg7: params[7]["value"];
  arg8: params[8]["value"];
  arg9: params[9]["value"];
  arg10: params[10]["value"];
  arg11: params[11]["value"];
  arg12: params[12]["value"];
  arg13: params[13]["value"];
  arg14: params[14]["value"];
  arg15: params[15]["value"];
}

type Test = Kind<[InvariantParam, CovariantParam]>["arg7"];

interface ReturnKind extends Kind {
  return: any;
}

export type $<
  kind extends Kind,
  params extends unknown[] = [],
  strict extends boolean = true,
> = kind extends ReturnKind
  ? (kind & {
      rawArgs: params;
      arg0: params[0];
      arg1: params[1];
      arg2: params[2];
      arg3: params[3];
      arg4: params[4];
      arg5: params[5];
      arg6: params[6];
      arg7: params[7];
      arg8: params[8];
      arg9: params[9];
      arg10: params[10];
      arg11: params[11];
      arg12: params[12];
      arg13: params[13];
      arg14: params[14];
      arg15: params[15];
    })["return"]
  : strict extends true
    ? {
        kind: kind;
        args: params;
      }
    : never;

export type $$<kind extends Kind, params extends unknown[] = []> = $<
  kind,
  params,
  false
>;

export namespace Kind {
  export type nullary = Kind<[]>;
  export type unary = Kind<[InvariantParam]>;
  export type binary = Kind<[InvariantParam, CovariantParam]>;
  export type ternary = Kind<[InvariantParam, CovariantParam, CovariantParam]>;

  // default types constructors
  export interface Array extends Kind.unary {
    return: this["arg0"][];
  }

  export interface Record
    extends Kind<[InvariantParam<string | number | symbol>, CovariantParam]> {
    return: globalThis.Record<this["arg0"], this["arg1"]>;
  }

  export interface Promise extends Kind.unary {
    return: globalThis.Promise<this["arg0"]>;
  }

  export interface Basic<T> extends Kind.nullary {
    return: T;
  }

  export type String = Basic<string>;
  export type Number = Basic<number>;
  export type Boolean = Basic<boolean>;
  export type Null = Basic<null>;
  export type Undefined = Basic<undefined>;
  export type Symbol = Basic<symbol>;
  export type BigInt = Basic<bigint>;
  export type Date = Basic<globalThis.Date>;
  export type RegExp = Basic<globalThis.RegExp>;
  export type Error = Basic<globalThis.Error>;
  export type Any = Basic<any>;
  export type Unknown = Basic<unknown>;
  export type Never = Basic<never>;
  export type Void = Basic<void>;
}

// interface Applicative<F extends Kind.unary> extends Functor<F> {
//   pure: <A>(a: A) => $<F, [A]>;
//   ap: <A, B>(fa: $<F, [A]>) => (fab: $<F, [(a: A) => B]>) => $<F, [B]>;
// }

// interface Monad<F extends Kind.unary> extends Applicative<F> {
//   bind: <A, B>(fa: $<F, [A]>, f: (a: A) => $<F, [B]>) => $<F, [B]>;
// }

// interface Foldable<F extends Kind.unary> {
//   reduce: <A, B>(f: (b: B, a: A) => B, b: B) => (fa: $<F, [A]>) => B;
//   fold: <A>(f: (b: A, a: A) => A) => (fa: $<F, [A]>) => A;
// }
