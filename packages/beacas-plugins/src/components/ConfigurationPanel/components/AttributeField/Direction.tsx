import { t } from "beacas-core";
import React, { ComponentProps, useMemo } from "react";
import { AttributeField } from ".";

export const DirectionOptions = [
  {
    value: "ltr",
    get label() {
      return t("Left to tight");
    },
  },
  {
    value: "rtl",
    get label() {
      return t("Right to left");
    },
  },
];

export function Direction(
  props: Omit<
    ComponentProps<typeof AttributeField.ButtonGroupField>,
    "label" | "options"
  > & {
    label?: React.ReactNode;
  }
) {
  const { path, name, ...rest } = props;

  return useMemo(() => {
    return (
      <div>
        <>
          <AttributeField.ButtonGroupField
            label={t("Direction")}
            name={`${name}.direction`}
            path={path}
            options={DirectionOptions}
            {...rest}
          />
        </>
      </div>
    );
  }, [name, path, rest]);
}
