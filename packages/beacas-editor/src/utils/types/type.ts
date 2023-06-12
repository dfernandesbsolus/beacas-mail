import { MERGE_TAG_PATTERN } from "beacas-core";

import { some, find } from "lodash";
import { validation } from "./index";

// Avoid recreate existing types
export const types: any = {};

export const initializeType = (typeConfig: any) => {
  if (types[typeConfig]) {
    return types[typeConfig];
  }

  const { typeConstructor } =
    find(validation, (type) => !!typeConfig.match(type.matcher)) || {};

  if (!typeConstructor) {
    throw new Error(`No type found for ${typeConfig}`);
  }

  types[typeConfig] = typeConstructor(typeConfig);

  return types[typeConfig];
};

export default class Type<T extends string | number | boolean> {
  matchers: RegExp[] = [];
  value: T;

  errorMessage?: string;

  constructor(value: T) {
    this.value = value;
  }

  isValid = () => {
    if (MERGE_TAG_PATTERN.test(this.value.toString())) return true;

    return some(this.matchers, (matcher) => `${this.value}`.match(matcher));
  };

  getErrorMessage = () => {
    if (this.isValid()) {
      return;
    }
    const errorMessage =
      this.errorMessage ||
      `Invalid value: ${this.value} for type ${this.constructor.name} `;

    return errorMessage.replace(/\$value/g, this.value.toString());
  };

  getValue = () => {
    return this.value;
  };
}
