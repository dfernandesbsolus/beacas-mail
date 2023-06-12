import Type from "./type";
import colors from "./helpers/colors";

export const matcher = /^color/gim;

const shorthandRegex = /^#\w{3}$/;
const replaceInputRegex = /^#(\w)(\w)(\w)$/;
const replaceOutput = "#$1$1$2$2$3$3";

export default () =>
  class Color extends Type<string> {
    constructor(color: string) {
      super(color);

      this.matchers = [
        /rgb\(\d{1,3},\s?\d{1,3},\s?\d{1,3}\)/gi,
        /^#([0-9a-f]{3}){1,2}$/gi,
        new RegExp(`^(${colors.join("|")})$`),
      ];
    }

    getValue = () => {
      if (typeof this.value === "string" && this.value.match(shorthandRegex)) {
        return this.value.replace(replaceInputRegex, replaceOutput);
      }

      return this.value;
    };
  };
