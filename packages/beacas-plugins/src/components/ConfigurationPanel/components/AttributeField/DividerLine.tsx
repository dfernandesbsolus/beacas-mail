import { t } from "beacas-core";
import React, { useMemo } from "react";
import { Path } from "slate";
import { AttributeField } from ".";

export const borderStyleOptions = [
  {
    value: "solid",
    get label() {
      return t("Solid");
    },
  },
  {
    value: "dashed",
    get label() {
      return t("Dashed");
    },
  },
  {
    value: "dotted",
    get label() {
      return t("Dotted");
    },
  },
];

export function DividerLine(props: { path: Path; name: string }) {
  const { path, name } = props;

  return useMemo(() => {
    return (
      <div>
        <>
          <AttributeField.Width
            label={t("Height")}
            path={path}
            suffix={t("px")}
            name={`${name}.border-width`}
            min={1}
            required
          />
          <AttributeField.SelectField
            label={t("Style")}
            name={`${name}.border-style`}
            path={path}
            options={borderStyleOptions}
          />

          <AttributeField.ColorPickerField
            label={t("Color")}
            path={path}
            name={`${name}.border-color`}
          />
        </>
      </div>
    );
  }, [name, path]);
}
