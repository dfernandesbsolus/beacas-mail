import { isNumber } from "lodash";

export const sliderAdapter = {
  formatter(val: string) {
    if (!val) return 0;
    val = val.toString();
    if (/^\d+px$/.test(val.trim())) return +val.replace("px", "");
    return +val;
  },
  normalize(val: string) {
    if (!isNumber(val)) return undefined;
    if (!val) return undefined;
    if (/^\d+$/.test(val)) return val + "px";
    return val;
  },
};
