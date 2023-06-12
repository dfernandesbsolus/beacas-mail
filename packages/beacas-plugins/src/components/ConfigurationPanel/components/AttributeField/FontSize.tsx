import { pixelNumberAdapter } from "@beacas-plugins/components/Form/adapter";
import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export function FontSize(
  props: Omit<
    ComponentProps<typeof AttributeField.PixelField>,
    "label" | "options"
  > & {
    label?: React.ReactNode;
  }
) {
  const { label = t("Font size") } = props;
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
