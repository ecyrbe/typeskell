import { describe, it, expect, expectTypeOf } from 'vitest';
import { Result, biFlatMap, orElse, ok, err } from '@data/result';
import { pipe } from '@utils/pipe';

describe('BiFlatMap', () => {
  it('should ignore when no error', () => {
    const input: Result<number, string> = ok(0);
    const result = pipe(
      input,
      orElse(() => ok(1)),
    );
    expectTypeOf(result).toEqualTypeOf<Result<number, never>>();
    expect(result).toEqual(ok(0));
  });

  it('should recover from error', () => {
    const input: Result<number, string> = err('error');
    const result = pipe(
      input,
      orElse(() => ok(1)),
    );
    expectTypeOf(result).toEqualTypeOf<Result<number, never>>();
    expect(result).toEqual(ok(1));
  });

  it('should output new error', () => {
    const input: Result<number, string> = err('error');
    const result = pipe(
      input,
      orElse(e => err(`${e}!`)),
    );
    expectTypeOf(result).toEqualTypeOf<Result<number, string>>();
    expect(result).toEqual(err('error!'));
  });
});
