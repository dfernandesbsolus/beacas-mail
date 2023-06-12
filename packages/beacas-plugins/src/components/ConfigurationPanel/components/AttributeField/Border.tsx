import { useEditorForm, useElementDefault } from "@beacas-plugins/hooks";
import { Element, t } from "beacas-core";
import { get, isUndefined } from "lodash";
import React, { useMemo } from "react";
import { Node, Path } from "slate";
import { useSlate } from "slate-react";
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

export function Border(props: {
  label?: React.ReactNode;
  path: Path;
  name: string;
}) {
  const { label = t("Border"), path, name } = props;
  const { getFieldValue } = useEditorForm();
  const editor = useSlate();
  const source = Node.get(editor, props.path) as Element;
  const defaultElement = useElementDefault({
    type: source.type,
    path: props.path,
  });

  let isEnabledBorder = getFieldValue(path, `${name}.border-enabled`);

  if (isUndefined(isEnabledBorder)) {
    isEnabledBorder = get(defaultElement, `${name}.border-enabled`);
  }

  return useMemo(() => {
    return (
      <div>
        <AttributeField.SwitchField
          label={label}
          name={`${name}.border-enabled`}
          path={path}
        />
        <>
          {isEnabledBorder && (
            <>
              <AttributeField.SelectField
                label={t("Style")}
                name={`${name}.border-style`}
                path={path}
                options={borderStyleOptions}
              />
              <AttributeField.Width
                label={<div></div>}
                path={path}
                suffix={t("px")}
                name={`${name}.border-width`}
                min={1}
                required
              />
              <AttributeField.ColorPickerField
                label={<div></div>}
                path={path}
                name={`${name}.border-color`}
              />
            </>
          )}
        </>
      </div>
    );
  }, [isEnabledBorder, label, name, path]);
}
