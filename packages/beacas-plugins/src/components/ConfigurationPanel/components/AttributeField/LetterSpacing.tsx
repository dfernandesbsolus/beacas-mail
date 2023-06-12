import { pixelNumberAdapter } from "@beacas-plugins/components/Form/adapter";
import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export function LetterSpacing(
  props: Omit<ComponentProps<typeof AttributeField.NumberField>, "label"> & {
    label?: React.ReactNode;
  }
) {
  const { label = t("Letter spacing") } = props;
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
