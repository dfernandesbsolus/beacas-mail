export const fontStyleAdapter = {
  formatter(val: string) {
    if (!val) return "normal";
    return val;
  },
  normalize(val: string) {
    if (val === "normal") return undefined;
    return val;
  },
};
