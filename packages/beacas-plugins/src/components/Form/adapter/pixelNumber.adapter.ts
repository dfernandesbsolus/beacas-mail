import { isNumber, isString } from "lodash";

export const pixelNumberAdapter = {
  formatter(val: string) {
    if (!isString(val)) return undefined;
    val = val.toString();
    if (/^\d+px$/.test(val.trim())) return +val.replace("px", "");
    return +val;
  },
  normalize(val: string) {
    if (!isNumber(val)) return undefined;
    if (/^\d+$/.test(val)) return val + "px";
    if (!val) return undefined;
    return val;
  },
};
