export interface Err<A, E> {
  readonly _tag: 'Err';
  readonly ok?: A; // for type inference so we don't loose the type of A
  readonly err: E;
}

export interface Ok<A, E> {
  readonly _tag: 'Ok';
  readonly ok: A;
  readonly err?: E; // for type inference so we don't loose the type of E
}

export type Result<A, E> = Ok<A, E> | Err<A, E>;
export type OkOf<R> = R extends Result<infer A, unknown> ? A : never;
export type ErrOf<R> = R extends Result<unknown, infer E> ? E : never;
export type ResultOf<R> = R extends Ok<infer A, infer E>
  ? Result<A, E>
  : R extends Err<infer A, infer E>
    ? Result<A, E>
    : R extends Result<infer A, infer E>
      ? Result<A, E>
      : never;
