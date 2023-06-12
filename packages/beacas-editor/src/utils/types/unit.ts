import { t } from "beacas-core";
import { escapeRegExp } from "lodash";
import Type from "./type";

export const matcher = /^(unit|unitWithNegative)\(.*\)/gim;

export default (params: string) => {
  const allowNeg = /^unitWithNegative/.exec(params) ? "-|" : "";

  const units = /\(([^)]+)\)/.exec(params)?.[1].split(",") as string[];
  const argsMatch = /\{([^}]+)\}/.exec(params);
  const args = (argsMatch && argsMatch[1] && argsMatch[1].split(",")) || ["1"]; // defaults to 1

  const allowAuto = units.includes("auto") ? "|auto" : "";
  const filteredUnits = units.filter((u) => u !== "auto");

  const allowUnits = units.join(", ");

  return class Unit extends Type<string> {
    errorMessage = t(
      `Has invalid value: $value for type Unit, only accepts (***) units`,
      allowUnits
    );

    constructor(value: string) {
      super(value);

      this.matchers = [
        new RegExp(
          `^(((${allowNeg}\\d|,|\\.){1,}(${filteredUnits
            .map(escapeRegExp)
            .join("|")})|0${allowAuto})( )?){${args.join(",")}}$`
        ),
      ];
    }
  };
};
