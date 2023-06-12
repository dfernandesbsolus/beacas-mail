import { isString } from "lodash";
import Color from "color";

export const colorAdapter = {
  formatter(val: string) {
    if (!isString(val) && !val) return undefined;

    try {
      val = val.toString();
      if (val.startsWith("#") && Color(val).hex()) {
        return val.replace("#", "");
      }
    } catch (error) {}
    return val;
  },
  normalize(val: string) {
    if (!isString(val)) return undefined;
    val = val.toString().trim();
    if (!val) return undefined;
    try {
      if (Color(`#${val}`).hex()) return `#${val}`;
    } catch (error) {}
    return val;
  },
};
