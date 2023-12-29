import { Kind, $ } from "@kinds";

// prettier-ignore
export type BuildGenericFn<N extends number, FnParams extends Kind, FnResult extends Kind> = N extends 1
  ? (...args: $<FnParams,[]>) => $<FnResult,[]>
  : N extends 2
    ? <B1>(...args: $<FnParams,[B1]>) => $<FnResult,[B1]>
    : N extends 3
      ? <B1, B2>(...args: $<FnParams,[B1,B2]>) => $<FnResult,[B1,B2]>
      : N extends 4
        ? <B1, B2, B3>(...args: $<FnParams,[B1,B2,B3]>) => $<FnResult,[B1,B2,B3]>
        : N extends 5
          ? <B1, B2, B3, B4>(...args: $<FnParams,[B1,B2,B3,B4]>) => $<FnResult,[B1,B2,B3,B4]>
          : N extends 6
            ? <B1, B2, B3, B4, B5>(...args: $<FnParams,[B1,B2,B3,B4,B5]>) => $<FnResult,[B1,B2,B3,B4,B5]>
            : N extends 7
              ? <B1, B2, B3, B4, B5, B6>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6]>) => $<FnResult,[B1,B2,B3,B4,B5,B6]>
              : N extends 8
                ? <B1, B2, B3, B4, B5, B6, B7>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7]>
                : N extends 9
                  ? <B1, B2, B3, B4, B5, B6, B7, B8>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8]>
                  : N extends 10
                    ? <B1, B2, B3, B4, B5, B6, B7, B8, B9>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9]>
                    : N extends 11
                      ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10]>
                      : N extends 12
                        ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11]>
                        : N extends 13
                          ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12]>
                          : N extends 14
                            ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13]>
                            : N extends 15
                              ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13, B14>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14]>
                              : N extends 16
                                ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13, B14, B15>(...args: $<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14,B15]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14,B15]>
                      : never;

/**
 * apply :: a -> (a -> b) -> b
 * @param a : parameter to apply to function
 * @returns (a -> b) -> b
 */
export const apply =
  <A>(a: A) =>
  <B>(f: (a: A) => B): B =>
    f(a);
