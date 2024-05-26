export const uniq = (arr: Array<any>) => [...new Set(arr)];

export const kebabCase = (s: string): string => {
  const ret = s.replace(/([A-Z])/g, " $1").trim();
  return ret.split(" ").join("-").toLowerCase();
};

export const camelize = (s: string): string =>
  s.replace(/-(\w)/g, (_: any, p: string) => p.toUpperCase());

export const bigCamelize = (s: string): string =>
  camelize(s).replace(s.charAt(0), s.charAt(0).toUpperCase());

export const isString = (val: unknown): val is string =>
  typeof val === "string";

export const isPlainObject = (val: unknown): val is Record<string, any> =>
  Object.prototype.toString.call(val) === "[object Object]";
