export type SplitAt<
  N extends number,
  T extends unknown[],
  $acc extends unknown[] = [],
> = $acc["length"] extends N
  ? [$acc, T]
  : T extends [infer H, ...infer R]
    ? SplitAt<N, R, [...$acc, H]>
    : [$acc, []];
