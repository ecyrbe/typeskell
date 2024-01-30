import { describe, it, expect, expectTypeOf } from 'vitest';
import * as R from '@data/result';
import { mapLeft, mapRight } from '@typeclass/bifunctor';
import { pipe } from '@utils/pipe';

const bifunctor = R.Bifunctor;

describe('Result', () => {
  it('should bimap on ok result', () => {
    const data: R.Result<number, Error> = R.ok(0);
    const result = pipe(
      data,
      R.bimap(
        x => x + 1,
        e => new Error(e.message),
      ),
    );
    expectTypeOf(result).toEqualTypeOf<R.Result<number, Error>>();
    expect(result).toEqual(R.ok(1));
  });

  it('should bimap on err result', () => {
    const data: R.Result<number, Error> = R.err(new Error('error'));
    const result = pipe(
      data,
      R.bimap(
        x => x + 1,
        e => new Error(`${e.message}!`),
      ),
    );
    expectTypeOf(result).toEqualTypeOf<R.Result<number, Error>>();
    expect(result).toEqual(R.err(new Error('error!')));
  });

  it('should map left on ok result', () => {
    const data: R.Result<number, Error> = R.ok(0);
    const result = pipe(
      data,
      mapLeft(bifunctor)(x => x + 1),
    );
    expectTypeOf(result).toEqualTypeOf<R.Result<number, Error>>();
    expect(result).toEqual(R.ok(1));

    const result2 = pipe(
      data,
      mapRight(bifunctor)(e => e.message),
    );
    expectTypeOf(result2).toEqualTypeOf<R.Result<number, string>>();
    expect(result2).toEqual(R.ok(0));
  });

  it('should map right on err result', () => {
    const data: R.Result<number, string> = R.err('error');
    const result = pipe(
      data,
      mapRight(bifunctor)(e => new Error(`${e}!`)),
    );
    expectTypeOf(result).toEqualTypeOf<R.Result<number, Error>>();
    expect(result).toEqual(R.err(new Error('error!')));

    const result2 = pipe(
      data,
      mapLeft(bifunctor)(x => x + 1),
    );
    expectTypeOf(result2).toEqualTypeOf<R.Result<number, string>>();
    expect(result2).toEqual(R.err('error'));
  });
});
