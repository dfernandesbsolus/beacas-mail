import { pixelNumberAdapter } from "@beacas-plugins/components/Form/adapter";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export function PixelField(
  props: ComponentProps<typeof AttributeField.NumberField>
) {
  return useMemo(() => {
    return (
      <AttributeField.NumberField formItem={pixelNumberAdapter} {...props} />
    );
  }, [props]);
}
