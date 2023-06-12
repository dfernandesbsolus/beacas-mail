import { IconFont } from "@beacas-plugins/components/IconFont";
import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

const options = [
  {
    value: "left",
    label: <IconFont iconName="icon-align-left" />,
  },
  {
    value: "center",
    label: <IconFont iconName="icon-align-center" />,
  },
  {
    value: "right",
    label: <IconFont iconName="icon-align-right" />,
  },
];

export function TextAlign(
  props: Omit<
    ComponentProps<typeof AttributeField.ButtonGroupField>,
    "label" | "options"
  > & {
    label?: React.ReactNode;
  }
) {
  const { label = t("Align") } = props;
  return useMemo(() => {
    return (
      <AttributeField.ButtonGroupField
        {...props}
        options={options}
        label={label}
      />
    );
  }, [label, props]);
}
