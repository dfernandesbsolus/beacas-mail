import { reduce } from 'lodash';
import { initializeType } from './types/type';

export const formatAttributes = (
  attributes: Record<string, string>,
  allowedAttributes: Record<string, string>,
) =>
  reduce(
    attributes,
    (acc, val, attrName) => {
      if (allowedAttributes && allowedAttributes[attrName]) {
        const TypeConstructor = initializeType(allowedAttributes[attrName]);

        if (TypeConstructor) {
          const type = new TypeConstructor(val);

          return {
            ...acc,
            [attrName]: type.getValue(),
          };
        }
      }

      return {
        ...acc,
        [attrName]: val,
      };
    },
    {},
  );
