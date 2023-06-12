import { isString } from "lodash";

export const pixelAdapter = {
  formatter(val: string) {
    if (!isString(val) && !val) return "";
    val = val.toString();
    if (/^\d+px$/.test(val.trim())) return val.replace("px", "");
    return val;
  },
  normalize(val: string) {
    if (!isString(val)) return undefined;
    val = val.toString().trim();
    if (!val) return undefined;
    if (/^\d+$/.test(val)) return val + "px";
    return val;
  },
};
