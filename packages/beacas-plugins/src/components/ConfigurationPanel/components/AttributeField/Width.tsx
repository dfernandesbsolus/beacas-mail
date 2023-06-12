import { pixelNumberAdapter } from "@beacas-plugins/components/Form/adapter";
import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export function Width(
  props: Omit<ComponentProps<typeof AttributeField.NumberField>, "label"> & {
    label?: React.ReactNode;
  }
) {
  const { label = t("Width") } = props;
  return useMemo(() => {
    return (
      <AttributeField.NumberField
        suffix={t("px")}
        {...props}
        label={label}
        formItem={{ ...pixelNumberAdapter, ...props.formItem }}
      />
    );
  }, [label, props]);
}
