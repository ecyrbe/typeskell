import { describe, it, expect, expectTypeOf } from "vitest";
import { mapComposition, flap } from "@typeclass/functor";
import { pipe } from "../pipe";
import * as R from "@data/result";
import * as A from "@data/array";

describe("Functor", () => {
  it("should map an array", () => {
    const data = [1, 2, 3];
    const result = pipe(
      data,
      A.map((x: number) => x + 1)
    );
    expectTypeOf(result).toEqualTypeOf<number[]>();
    expect(result).toEqual([2, 3, 4]);
  });

  it("should map an array twice", () => {
    const data = [1, 2, 3];
    const result = pipe(
      data,
      A.map((x) => x + 1),
      A.map((x) => x * 2)
    );
    expectTypeOf(result).toEqualTypeOf<number[]>();
    expect(result).toEqual([4, 6, 8]);
  });

  it("should map with Either", () => {
    const data: R.Result<number, Error> = R.ok(0);
    const result = pipe(
      data,
      R.map((x) => x + 1)
    );
    expectTypeOf(result).toEqualTypeOf<R.Result<number, Error>>();
    expect(result).toEqual(R.ok(1));
  });

  it("should map with Either twice", () => {
    const data: R.Result<number, Error> = R.ok(0);
    const result = pipe(
      data,
      R.map((x) => x + 1),
      R.map((x) => x * 2)
    );
    expectTypeOf(result).toEqualTypeOf<R.Result<number, Error>>();
    expect(result).toEqual(R.ok(2));
  });

  it("should compose two array functors", () => {
    const data = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const result = pipe(
      data,
      mapComposition(A.Functor, A.Functor)((x) => x + 1),
      mapComposition(A.Functor, A.Functor)((x) => ({ x }))
    );
    expectTypeOf(result).toEqualTypeOf<{ x: number }[][]>();
    expect(result).toEqual([
      [{ x: 2 }, { x: 3 }, { x: 4 }],
      [{ x: 5 }, { x: 6 }, { x: 7 }],
    ]);
  });

  it("should compose two array functors with generics", () => {
    const data = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    function toX<T>(x: T) {
      return { x };
    }

    function mapToX() {
      return mapComposition(A.Functor, A.Functor)(toX);
    }

    type MapToX = ReturnType<typeof mapToX>;

    expectTypeOf<MapToX>().toEqualTypeOf<
      <T>(self: T[][]) => {
        x: T;
      }[][]
    >();

    const result = pipe(data, mapToX());
    expectTypeOf(result).toEqualTypeOf<{ x: number }[][]>();
    expect(result).toEqual([
      [{ x: 1 }, { x: 2 }, { x: 3 }],
      [{ x: 4 }, { x: 5 }, { x: 6 }],
    ]);
  });

  it("should compose two either functors", () => {
    const data: R.Result<R.Result<number, ErrorConstructor>, Error> = R.ok(
      R.ok(0)
    );
    const result = pipe(
      data,
      R.map(R.map((x) => x + 1)),
      mapComposition(R.Functor, R.Functor)((x) => ({ x }))
    );
    expectTypeOf(result).toEqualTypeOf<
      R.Result<R.Result<{ x: number }, ErrorConstructor>, Error>
    >();
    expect(result).toEqual(R.ok(R.ok({ x: 1 })));
  });

  it("should compose one array and one either functors with generics", () => {
    const data: R.Result<number, Error>[] = [R.ok(0), R.ok(1), R.ok(2)];

    function toX<T>(x: T) {
      return { x };
    }

    const mapToX = <T>() => mapComposition(A.Functor, R.Functor)(toX<T>);

    type MapToX = typeof mapToX;

    expectTypeOf<MapToX>().toEqualTypeOf<
      <T>() => <B1>(fa: R.Result<T, B1>[]) => R.Result<
        {
          x: T;
        },
        B1
      >[]
    >();

    const result = pipe(
      data,
      mapComposition(A.Functor, R.Functor)((x) => x + 1),
      A.map(R.map((x) => x * 2)),
      mapToX()
    );
    expectTypeOf(result).toEqualTypeOf<R.Result<{ x: number }, Error>[]>();
    expect(result).toEqual([R.ok({ x: 2 }), R.ok({ x: 4 }), R.ok({ x: 6 })]);
  });

  it("should flap with array", () => {
    const data = [(x: number) => x + 1, (x: number) => x * 2];
    const result = pipe(data, flap(A.Functor)(2));
    expectTypeOf(result).toEqualTypeOf<number[]>();
    expect(result).toEqual([3, 4]);
  });
});
