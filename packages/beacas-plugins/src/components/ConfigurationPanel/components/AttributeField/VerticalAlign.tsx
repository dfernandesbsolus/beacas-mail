import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

const options = [
  {
    value: "top",
    get label() {
      return t("top");
    },
  },
  {
    value: "middle",
    get label() {
      return t("middle");
    },
  },
  {
    value: "bottom",
    get label() {
      return t("bottom");
    },
  },
];

export function VerticalAlign(
  props: Omit<
    ComponentProps<typeof AttributeField.ButtonGroupField>,
    "label" | "options"
  > & {
    label?: React.ReactNode;
  }
) {
  const { label = t("Vertical Align") } = props;
  return useMemo(() => {
    return (
      <AttributeField.ButtonGroupField
        options={options}
        {...props}
        label={label}
      />
    );
  }, [label, props]);
}
