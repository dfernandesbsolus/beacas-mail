import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export function BackgroundColor(
  props: Omit<
    ComponentProps<typeof AttributeField.ColorPickerField>,
    "label"
  > & {
    label?: React.ReactNode;
  }
) {
  const { label = t("Background color") } = props;
  return useMemo(() => {
    return <AttributeField.ColorPickerField {...props} label={label} />;
  }, [label, props]);
}
