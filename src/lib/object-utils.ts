/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

export const omit = <
  T extends Record<string, unknown> | object,
  K extends keyof any,
>(
  inputObj: T,
  ...keys: K[]
): Omit<T, K> => {
  const keysSet = new Set(keys);
  return Object.fromEntries(
    Object.entries(inputObj).filter(([k]) => !keysSet.has(k as any)),
  ) as any;
};

export const pick = <
  T extends Record<string, unknown> | object,
  K extends keyof T,
>(
  inputObj: T,
  ...keys: K[]
): Pick<T, K> => {
  const keysSet = new Set(keys);
  return Object.fromEntries(
    Object.entries(inputObj).filter(([k]) => keysSet.has(k as any)),
  ) as any;
};
