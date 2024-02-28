import { Kind } from '@kinds';

export namespace Option {
  export interface None<A> {
    readonly _tag: 'None';
    readonly value?: A; // for type inference so we don't loose the type of A
  }

  export interface Some<A> {
    readonly _tag: 'Some';
    readonly value: A;
  }
}

export type Option<A> = Option.None<A> | Option.Some<A>;
export type OptionParamOf<O> = O extends Option<infer A> ? A : never;
export type OptionOf<O> = O extends Option.Some<infer A>
  ? Option<A>
  : O extends Option.None<infer A>
    ? Option<A>
    : O extends Option<infer A>
      ? Option<A>
      : never;

export interface TOption extends Kind.unary {
  return: Option<this['arg0']>;
}
