export const LANGUAGE_IDS = [
  "vue",
  "typescript",
  "javascript",
  "javascriptreact",
  "typescriptreact",
];
export const TAG_LINK_RE = /(?<=<vs-)([\w-]+)/g;
export const TAG_BIG_CAMELIZE_RE = /(?<=<Vs)([\w-]+)/g;
export const ATTR_RE = /(?:<(vs-[\w-]+)[^>/]*)|(?:<(Vs[\w-]+)[^>/]*)/g;
export const PROP_NAME_RE = /name=['"][\w-]*/;
