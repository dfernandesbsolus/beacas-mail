import { getFallbackValue } from "@beacas-plugins/utils/getFallbackValue";
import { Element, t, TextElement } from "beacas-core";
import { ActiveTabKeys } from "beacas-editor";
import React, { useMemo } from "react";
import { Path } from "slate";
import { AttributeField } from ".";
import { useElementDefault } from "@beacas-plugins/hooks";

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

export function Typography(props: {
  label?: string;
  type: Element["type"];
  name: string;
  path: Path;
  defaultElement?: ReturnType<typeof useElementDefault<TextElement>>;
  mode: ActiveTabKeys;
}) {
  const { label = t("Font"), path, defaultElement } = props;

  return useMemo(() => {
    return (
      <div key={props.type}>
        <>
          <AttributeField.FontFamily
            label={label}
            name={`${props.name}.font-family`}
            path={path}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "font-family",
            })}
          />
          <AttributeField.FontSize
            label={t("Size")}
            path={path}
            name={`${props.name}.font-size`}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "font-size",
            })}
          />

          <AttributeField.ColorPickerField
            label={t("Color")}
            path={path}
            name={`${props.name}.color`}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "color",
            })}
          />
          <AttributeField.LineHeight
            label={t("Line height")}
            path={path}
            name={`${props.name}.line-height`}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "line-height",
            })}
          />
          <AttributeField.FontWeight
            label={t("Style")}
            path={path}
            name={`${props.name}.font-weight`}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "font-weight",
            })}
          />
          <AttributeField.LetterSpacing
            path={path}
            name={`${props.name}.letter-spacing`}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "letter-spacing",
            })}
          />
          <AttributeField.TextAndHeadingStyle
            label={<div></div>}
            path={path}
            name={`${props.name}`}
          />
        </>
      </div>
    );
  }, [defaultElement, label, path, props.mode, props.name, props.type]);
}
