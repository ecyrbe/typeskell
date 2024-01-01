import { ConcreteKind } from "@kinds";

export type $<
  kind,
  params extends unknown[] = [],
  strict extends boolean = true,
> = kind extends ConcreteKind
  ? (kind & {
      rawArgs: params;
      arg0: params[0];
      arg1: params[1];
      arg2: params[2];
      arg3: params[3];
      arg4: params[4];
      arg5: params[5];
      arg6: params[6];
      arg7: params[7];
      arg8: params[8];
      arg9: params[9];
      arg10: params[10];
      arg11: params[11];
      arg12: params[12];
      arg13: params[13];
      arg14: params[14];
      arg15: params[15];
    })["return"]
  : strict extends true
    ? {
        kind: kind;
        arg0: params[0];
        //        params: params;
      }
    : never;

export type $$<kind, params extends unknown[] = []> = $<kind, params, false>;
