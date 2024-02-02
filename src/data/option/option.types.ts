import { Kind } from '@kinds';

export interface None<A> {
  readonly _tag: 'None';
  readonly value?: A; // for type inference so we don't loose the type of A
}

export interface Some<A> {
  readonly _tag: 'Some';
  readonly value: A;
}

export type Option<A> = None<A> | Some<A>;
export type OptionParamOf<O> = O extends Option<infer A> ? A : never;
export type OptionOf<O> = O extends Some<infer A>
  ? Option<A>
  : O extends None<infer A>
    ? Option<A>
    : O extends Option<infer A>
      ? Option<A>
      : never;

export interface TOption extends Kind.unary {
  return: Option<this['arg0']>;
}
