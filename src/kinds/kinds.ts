import { ContravariantParam, Covariant, CovariantParam, Invariant, InvariantParam, Param } from './variance';

export interface Kind<params extends Param[] = Param[]> {
  signature: params; // keep track of variance signature
  rawArgs: unknown;
  arity: params['length'];
  // arguments in signature are defined with the given variance contraint
  arg0: params[0]['value'];
  arg1: params[1]['value'];
  arg2: params[2]['value'];
  arg3: params[3]['value'];
  arg4: params[4]['value'];
  arg5: params[5]['value'];
  arg6: params[6]['value'];
  arg7: params[7]['value'];
  arg8: params[8]['value'];
  arg9: params[9]['value'];
  arg10: params[10]['value'];
  arg11: params[11]['value'];
  arg12: params[12]['value'];
  arg13: params[13]['value'];
  arg14: params[14]['value'];
  arg15: params[15]['value'];
}

export interface ConcreteKind extends Kind {
  return: any;
}

export namespace Kind {
  export type nullary = Kind<[]>;
  export type unary = Kind<[InvariantParam]>;
  export type binary = Kind<[InvariantParam, CovariantParam]>;
  export type ternary = Kind<[InvariantParam, CovariantParam, CovariantParam]>;
  export type quaternary = Kind<[InvariantParam, CovariantParam, CovariantParam, ContravariantParam]>;

  // default types constructors
  export interface Array extends Kind.unary {
    return: this['arg0'][];
  }
  interface Generic<F extends 'F' | 'G' | 'H'> extends Kind.unary {
    return: [F, Invariant<this['arg0']>];
  }

  export type F = Generic<'F'>;
  export type G = Generic<'G'>;
  export type H = Generic<'H'>;

  interface Generic2<F extends 'F' | 'G' | 'H'> extends Kind.binary {
    return: [F, Invariant<this['arg0']>, Covariant<this['arg1']>];
  }

  export type F2 = Generic2<'F'>;
  export type G2 = Generic2<'G'>;
  export type H2 = Generic2<'H'>;

  export interface Record extends Kind<[InvariantParam<string | number | symbol>, CovariantParam]> {
    return: globalThis.Record<this['arg0'], this['arg1']>;
  }

  export interface Promise extends Kind.unary {
    return: globalThis.Promise<this['arg0']>;
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
