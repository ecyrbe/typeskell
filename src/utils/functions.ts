import { HKT, $, $$ } from '@kinds';

// prettier-ignore
type GenericFnA<N extends number, FnParams extends HKT, FnResult extends HKT> = N extends 0
  ? (...args: $$<FnParams,[]>) => $<FnResult,[]>
  : N extends 1
    ? <A1>(...args: $$<FnParams,[A1]>) => $<FnResult,[A1]>
    : N extends 2
      ? <A1, A2>(...args: $$<FnParams,[A1,A2]>) => $<FnResult,[A1,A2]>
      : N extends 3
        ? <A1, A2, A3>(...args: $$<FnParams,[A1,A2,A3]>) => $<FnResult,[A1,A2,A3]>
        : N extends 4
          ? <A1, A2, A3, A4>(...args: $$<FnParams,[A1,A2,A3,A4]>) => $<FnResult,[A1,A2,A3,A4]>
          : N extends 5
            ? <A1, A2, A3, A4, A5>(...args: $$<FnParams,[A1,A2,A3,A4,A5]>) => $<FnResult,[A1,A2,A3,A4,A5]>
            : N extends 6
              ? <A1, A2, A3, A4, A5, A6>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6]>) => $<FnResult,[A1,A2,A3,A4,A5,A6]>
              : N extends 7
                ? <A1, A2, A3, A4, A5, A6, A7>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7]>
                : N extends 8
                  ? <A1, A2, A3, A4, A5, A6, A7, A8>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7,A8]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7,A8]>
                  : N extends 9
                    ? <A1, A2, A3, A4, A5, A6, A7, A8, A9>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7,A8,A9]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7,A8,A9]>
                    : N extends 10
                      ? <A1, A2, A3, A4, A5, A6, A7, A8, A9, A10>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10]>
                      : N extends 11
                        ? <A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11]>
                        : N extends 12
                          ? <A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12]>
                          : N extends 13
                            ? <A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13]>
                            : N extends 14
                              ? <A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,A14]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,A14]>
                              : N extends 15
                                ? <A1, A2, A3, A4, A5, A6, A7, A8, A9, A10, A11, A12, A13, A14, A15>(...args: $$<FnParams,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,A14,A15]>) => $<FnResult,[A1,A2,A3,A4,A5,A6,A7,A8,A9,A10,A11,A12,A13,A14,A15]>
                      : never;

// prettier-ignore
type GenericFnB<N extends number, FnParams extends HKT, FnResult extends HKT> = N extends 0
  ? (...args: $$<FnParams,[]>) => $<FnResult,[]>
  : N extends 1
    ? <B1>(...args: $$<FnParams,[B1]>) => $<FnResult,[B1]>
    : N extends 2
      ? <B1, B2>(...args: $$<FnParams,[B1,B2]>) => $<FnResult,[B1,B2]>
      : N extends 3
        ? <B1, B2, B3>(...args: $$<FnParams,[B1,B2,B3]>) => $<FnResult,[B1,B2,B3]>
        : N extends 4
          ? <B1, B2, B3, B4>(...args: $$<FnParams,[B1,B2,B3,B4]>) => $<FnResult,[B1,B2,B3,B4]>
          : N extends 5
            ? <B1, B2, B3, B4, B5>(...args: $$<FnParams,[B1,B2,B3,B4,B5]>) => $<FnResult,[B1,B2,B3,B4,B5]>
            : N extends 6
              ? <B1, B2, B3, B4, B5, B6>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6]>) => $<FnResult,[B1,B2,B3,B4,B5,B6]>
              : N extends 7
                ? <B1, B2, B3, B4, B5, B6, B7>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7]>
                : N extends 8
                  ? <B1, B2, B3, B4, B5, B6, B7, B8>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8]>
                  : N extends 9
                    ? <B1, B2, B3, B4, B5, B6, B7, B8, B9>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9]>
                    : N extends 10
                      ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10]>
                      : N extends 11
                        ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11]>
                        : N extends 12
                          ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12]>
                          : N extends 13
                            ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13]>
                            : N extends 14
                              ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13, B14>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14]>
                              : N extends 15
                                ? <B1, B2, B3, B4, B5, B6, B7, B8, B9, B10, B11, B12, B13, B14, B15>(...args: $$<FnParams,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14,B15]>) => $<FnResult,[B1,B2,B3,B4,B5,B6,B7,B8,B9,B10,B11,B12,B13,B14,B15]>
                      : never;

// prettier-ignore
type GenericFnC<N extends number, FnParams extends HKT, FnResult extends HKT> = N extends 0
? (...args: $$<FnParams,[]>) => $<FnResult,[]>
: N extends 1
  ? <C1>(...args: $$<FnParams,[C1]>) => $<FnResult,[C1]>
  : N extends 2
    ? <C1, C2>(...args: $$<FnParams,[C1,C2]>) => $<FnResult,[C1,C2]>
    : N extends 3
      ? <C1, C2, C3>(...args: $$<FnParams,[C1,C2,C3]>) => $<FnResult,[C1,C2,C3]>
      : N extends 4
        ? <C1, C2, C3, C4>(...args: $$<FnParams,[C1,C2,C3,C4]>) => $<FnResult,[C1,C2,C3,C4]>
        : N extends 5
          ? <C1, C2, C3, C4, C5>(...args: $$<FnParams,[C1,C2,C3,C4,C5]>) => $<FnResult,[C1,C2,C3,C4,C5]>
          : N extends 6
            ? <C1, C2, C3, C4, C5, C6>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6]>) => $<FnResult,[C1,C2,C3,C4,C5,C6]>
            : N extends 7
              ? <C1, C2, C3, C4, C5, C6, C7>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7]>
              : N extends 8
                ? <C1, C2, C3, C4, C5, C6, C7, C8>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7,C8]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7,C8]>
                : N extends 9
                  ? <C1, C2, C3, C4, C5, C6, C7, C8, C9>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7,C8,C9]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7,C8,C9]>
                  : N extends 10
                    ? <C1, C2, C3, C4, C5, C6, C7, C8, C9, C10>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10]>
                    : N extends 11
                      ? <C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11]>
                      : N extends 12
                        ? <C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12]>
                        : N extends 13
                          ? <C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13]>
                          : N extends 14
                            ? <C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13, C14>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13,C14]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13,C14]>
                            : N extends 15
                              ? <C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11, C12, C13, C14, C15>(...args: $$<FnParams,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13,C14,C15]>) => $<FnResult,[C1,C2,C3,C4,C5,C6,C7,C8,C9,C10,C11,C12,C13,C14,C15]>
                    : never;

// prettier-ignore
type GenericFnD<N extends number, FnParams extends HKT, FnResult extends HKT> = N extends 0
? (...args: $$<FnParams,[]>) => $<FnResult,[]>
: N extends 1
  ? <D1>(...args: $$<FnParams,[D1]>) => $<FnResult,[D1]>
  : N extends 2
    ? <D1, D2>(...args: $$<FnParams,[D1,D2]>) => $<FnResult,[D1,D2]>
    : N extends 3
      ? <D1, D2, D3>(...args: $$<FnParams,[D1,D2,D3]>) => $<FnResult,[D1,D2,D3]>
      : N extends 4
        ? <D1, D2, D3, D4>(...args: $$<FnParams,[D1,D2,D3,D4]>) => $<FnResult,[D1,D2,D3,D4]>
        : N extends 5
          ? <D1, D2, D3, D4, D5>(...args: $$<FnParams,[D1,D2,D3,D4,D5]>) => $<FnResult,[D1,D2,D3,D4,D5]>
          : N extends 6
            ? <D1, D2, D3, D4, D5, D6>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6]>) => $<FnResult,[D1,D2,D3,D4,D5,D6]>
            : N extends 7
              ? <D1, D2, D3, D4, D5, D6, D7>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7]>
              : N extends 8
                ? <D1, D2, D3, D4, D5, D6, D7, D8>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7,D8]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7,D8]>
                : N extends 9
                  ? <D1, D2, D3, D4, D5, D6, D7, D8, D9>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7,D8,D9]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7,D8,D9]>
                  : N extends 10
                    ? <D1, D2, D3, D4, D5, D6, D7, D8, D9, D10>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10]>
                    : N extends 11
                      ? <D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11]>
                      : N extends 12
                        ? <D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12]>
                        : N extends 13
                          ? <D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13]>
                          : N extends 14
                            ? <D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14]>
                            : N extends 15
                              ? <D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15>(...args: $$<FnParams,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14,D15]>) => $<FnResult,[D1,D2,D3,D4,D5,D6,D7,D8,D9,D10,D11,D12,D13,D14,D15]>
                    : never;

export type GenericFn<
  N extends number,
  FnParams extends HKT,
  FnResult extends HKT,
  Alpha extends 'A' | 'B' | 'C' | 'D' = 'A',
> = Alpha extends 'A'
  ? GenericFnA<N, FnParams, FnResult>
  : Alpha extends 'B'
    ? GenericFnB<N, FnParams, FnResult>
    : Alpha extends 'C'
      ? GenericFnC<N, FnParams, FnResult>
      : Alpha extends 'D'
        ? GenericFnD<N, FnParams, FnResult>
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

export const identity = <A>(a: A): A => a;
