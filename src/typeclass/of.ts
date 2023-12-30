import type { Kind, $ } from "@kinds";

export interface Of<F extends Kind> {
  of: <A>(a: A) => $<F, [A, never]>;
}
