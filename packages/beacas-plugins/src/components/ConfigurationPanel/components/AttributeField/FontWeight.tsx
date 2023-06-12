import { SelectField } from "@beacas-plugins/components/Form";
import { fontWeightAdapter } from "@beacas-plugins/components/Form/adapter";
import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

const options = [
  {
    value: "normal",
    get label() {
      return t("Normal");
    },
  },
  {
    value: "bold",
    get label() {
      return t("Bold");
    },
  },
  {
    value: "100",
    label: "100",
  },
  {
    value: "200",
    label: "200",
  },
  {
    value: "300",
    label: "300",
  },
  {
    value: "400",
    label: "400",
  },
  {
    value: "500",
    label: "500",
  },
  {
    value: "600",
    label: "600",
  },
  {
    value: "700",
    label: "700",
  },
  {
    value: "800",
    label: "800",
  },
  {
    value: "900",
    label: "900",
  },
];

export function FontWeight(
  props: Omit<
    ComponentProps<typeof AttributeField.SelectField>,
    "label" | "options"
  > & {
    label?: React.ReactNode;
  }
) {
  return useMemo(
    () => (
      <SelectField
        label={t("Font weight")}
        options={options}
        {...props}
        formItem={{ ...fontWeightAdapter, ...props.formItem }}
      />
    ),
    [props]
  );
}
