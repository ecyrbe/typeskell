import { describe, it, expect, expectTypeOf } from "vitest";
import { Functor, mapComposition, flap } from "@typeclass/functor";
import { Kind, $ } from "@kinds";
import { pipe } from "../pipe";

// implementation for Array
const A: Functor<Kind.Array> = {
  map: (f) => (fa) => fa.map(f),
};

// implementation for Either
type Result<A, E> = { kind: "error"; value: E } | { kind: "ok"; value: A };

// type constructor for Either * -> * -> *
interface TResult extends Kind.binary {
  return: Result<this["arg0"], this["arg1"]>;
}

const ok = <A, E>(a: A): Result<A, E> => ({
  kind: "ok",
  value: a,
});
const fail = <A, E>(e: E): Result<A, E> => ({
  kind: "error",
  value: e,
});

const E: Functor<TResult> = {
  map: (f) => (fa) =>
    fa.kind === "error" ? fa : { kind: "ok", value: f(fa.value) },
};

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
    const data = ok<number, Error>(0);
    const result = pipe(
      data,
      E.map((x) => x + 1)
    );
    expectTypeOf(result).toEqualTypeOf<Result<number, Error>>();
    expect(result).toEqual(ok<number, Error>(1));
  });

  it("should map with Either twice", () => {
    const data = ok<number, Error>(0);
    const result = pipe(
      data,
      E.map((x) => x + 1),
      E.map((x) => x * 2)
    );
    expectTypeOf(result).toEqualTypeOf<Result<number, Error>>();
    expect(result).toEqual(ok<number, Error>(2));
  });

  it("should compose two array functors", () => {
    const data = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    const result = pipe(
      data,
      mapComposition(A, A)((x) => x + 1),
      mapComposition(A, A)((x) => ({ x }))
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
      return mapComposition(A, A)(toX);
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
    const data = ok<Result<number, ErrorConstructor>, Error>(
      ok<number, ErrorConstructor>(0)
    );
    const result = pipe(
      data,
      E.map(E.map((x) => x + 1)),
      mapComposition(E, E)((x) => ({ x }))
    );
    expectTypeOf(result).toEqualTypeOf<
      Result<Result<{ x: number }, ErrorConstructor>, Error>
    >();
    expect(result).toEqual(ok(ok({ x: 1 })));
  });

  it("should compose one array and one either functors with generics", () => {
    const data = [
      ok<number, Error>(0),
      ok<number, Error>(1),
      ok<number, Error>(2),
    ];

    function toX<T>(x: T) {
      return { x };
    }

    const mapToX = <T>() => mapComposition(A, E)(toX<T>);

    type MapToX = typeof mapToX;

    expectTypeOf<MapToX>().toEqualTypeOf<
      <T>() => <GC>(fa: Result<T, GC>[]) => Result<
        {
          x: T;
        },
        GC
      >[]
    >();

    const result = pipe(
      data,
      mapComposition(A, E)((x) => x + 1),
      A.map(E.map((x) => x * 2)),
      mapToX()
    );
    expectTypeOf(result).toEqualTypeOf<Result<{ x: number }, Error>[]>();
    expect(result).toEqual([ok({ x: 2 }), ok({ x: 4 }), ok({ x: 6 })]);
  });

  it("should flap with array", () => {
    const data = [(x: number) => x + 1, (x: number) => x * 2];
    const result = pipe(data, flap(A)(2));
    expectTypeOf(result).toEqualTypeOf<number[]>();
    expect(result).toEqual([3, 4]);
  });
});
