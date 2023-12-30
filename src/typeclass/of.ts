import type { Kind, $ } from "@kinds";
import { ToDefaultParam } from "../kinds/defaults";
import { Tail } from "../utils/tuples";

export interface Of<F extends Kind> {
  of: <A>(a: A) => $<F, [A, ...Tail<ToDefaultParam<F["signature"]>>]>;
}
