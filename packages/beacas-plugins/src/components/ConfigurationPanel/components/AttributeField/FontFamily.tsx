import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";
import { useFontFamily } from "@beacas-plugins/hooks";

export function FontFamily(
  props: Omit<
    ComponentProps<typeof AttributeField.SelectField>,
    "label" | "options"
  > & {
    label?: React.ReactNode;
  }
) {
  const { fontList } = useFontFamily();
  return useMemo(
    () => (
      <AttributeField.SelectField
        label={t("Font family")}
        options={fontList}
        {...props}
      />
    ),
    [fontList, props]
  );
}
