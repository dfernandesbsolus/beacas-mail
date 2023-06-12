import { ButtonElement, Element, ElementCategory, t } from "beacas-core";
import { ActiveTabKeys } from "beacas-editor";
import React, { useMemo } from "react";
import { AttributeField } from ".";
import { useElementDefault } from "@beacas-plugins/hooks";

export const borderStyleOptions = [
  {
    value: "solid",
    get label() {
      return t("Solid");
    },
  },
  {
    value: "dashed",
    get label() {
      return t("Dashed");
    },
  },
  {
    value: "dotted",
    get label() {
      return t("Dotted");
    },
  },
];

const category = ElementCategory.BUTTON;

const path = [0];
export function ButtonCategory(props: {
  label?: string;
  type: Element["type"];
}) {
  const element = useElementDefault<ButtonElement>({
    type: props.type,
    path: null,
  });

  return useMemo(() => {
    return (
      <div>
        <AttributeField.Buttons
          mode={ActiveTabKeys.DESKTOP}
          defaultElement={element}
          path={path}
          {...props}
          name={`data.categoryAttributes.${category}`}
        />
      </div>
    );
  }, [element, props]);
}
