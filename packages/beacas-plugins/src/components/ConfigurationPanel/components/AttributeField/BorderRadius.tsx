import { pixelNumberAdapter } from "@beacas-plugins/components/Form/adapter";
import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export function BorderRadius(
  props: Omit<ComponentProps<typeof AttributeField.PixelField>, "label"> & {
    label?: React.ReactNode;
  }
) {
  const { label = t("Corner radius") } = props;
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
