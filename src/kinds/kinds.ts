export interface Kind<params extends unknown[] = unknown[]> {
  args: params;
  rawArgs: unknown;
  length: params["length"];
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
}

interface ReturnKind extends Kind {
  return: any;
}

export type $<
  kind extends Kind,
  params extends unknown[] = [],
> = kind extends ReturnKind
  ? (kind & {
      args: params;
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
  : never;

export namespace Kind {
  export type nullary = Kind<[]>;
  export type unary = Kind<[unknown]>;
  export type binary = Kind<[unknown, unknown]>;
  export type ternary = Kind<[unknown, unknown, unknown]>;
  export type quaternary = Kind<[unknown, unknown, unknown, unknown]>;
  export type quinary = Kind<[unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type senary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type septenary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type octonary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type nonary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type denary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type undenary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type duodenary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type tredenary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type quadenary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
  // prettier-ignore
  export type quindenary = Kind<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;

  // default types constructors
  export interface Array extends Kind.unary {
    return: this["arg0"][];
  }

  export interface String extends Kind.nullary {
    return: string;
  }

  export interface Number extends Kind.nullary {
    return: number;
  }

  export interface Boolean extends Kind.nullary {
    return: boolean;
  }

  export interface Null extends Kind.nullary {
    return: null;
  }

  export interface Undefined extends Kind.nullary {
    return: undefined;
  }

  export interface Symbol extends Kind.nullary {
    return: symbol;
  }

  export interface BigInt extends Kind.nullary {
    return: bigint;
  }

  export interface Date extends Kind.nullary {
    return: globalThis.Date;
  }

  export interface Record extends Kind<[string | number | symbol, unknown]> {
    return: globalThis.Record<this["arg0"], this["arg1"]>;
  }

  export interface Any extends Kind.nullary {
    return: any;
  }

  export interface Unknown extends Kind.nullary {
    return: unknown;
  }

  export interface Never extends Kind.nullary {
    return: never;
  }

  export interface Void extends Kind.nullary {
    return: void;
  }

  export interface Promise extends Kind.unary {
    return: globalThis.Promise<this["args"][0]>;
  }
}

interface UnaryFn extends Kind.binary {
  return: (a: this["arg0"]) => this["arg1"];
}

interface BinaryFn extends Kind.ternary {
  return: (a: this["args"][0], b: this["args"][1]) => this["args"][2];
}

interface FunctionKind extends Kind.binary {
  return: (
    ...args: this["args"][0] extends infer R extends any[]
      ? R
      : [this["args"][0]]
  ) => this["args"][1];
}

interface OmitKind extends Kind<[unknown, string | number | symbol]> {
  return: Omit<this["args"][0], this["args"][1]>;
}

interface PickKind extends Kind<[unknown, unknown]> {
  return: this["args"][1] extends keyof this["args"][0]
    ? Pick<this["args"][0], this["args"][1]>
    : [this["args"][1], "is not a key of", this["args"][0]];
}

interface ReadonlyKind extends Kind<[unknown]> {
  return: Readonly<this["args"][0]>;
}

interface ReadonlyArrayKind extends Kind<[unknown]> {
  return: ReadonlyArray<this["args"][0]>;
}

interface LowercaseKind extends Kind<[string]> {
  return: Lowercase<this["args"][0]>;
}

interface UppercaseKind extends Kind<[string]> {
  return: Uppercase<this["args"][0]>;
}

interface CapitalizeKind extends Kind<[string]> {
  return: Capitalize<this["args"][0]>;
}

interface UncapitalizeKind extends Kind<[string]> {
  return: Uncapitalize<this["args"][0]>;
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
