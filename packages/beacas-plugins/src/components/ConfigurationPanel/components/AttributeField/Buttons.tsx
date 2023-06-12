import { Divider, Grid } from "@arco-design/web-react";
import { getFallbackValue } from "@beacas-plugins/utils/getFallbackValue";
import { Element, t } from "beacas-core";
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

export function Buttons(props: {
  label?: string;
  type: Element["type"];
  mode: ActiveTabKeys;
  defaultElement?: ReturnType<typeof useElementDefault>;
  name: string;
  path: Path;
  hidePadding?: boolean;
}) {
  const { label = t("Font"), type, defaultElement, path } = props;

  return useMemo(() => {
    return (
      <div>
        <>
          <AttributeField.FontFamily
            label={label}
            name={`${props.name}.font-family`}
            path={path}
            formItem={{
              labelCol: { span: 6, offset: 2, style: { lineHeight: 1.15 } },
              wrapperCol: { span: 15, offset: 0 },
            }}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "font-family",
            })}
          />

          <AttributeField.FontWeight
            label={t("Style")}
            path={path}
            name={`${props.name}.font-weight`}
            formItem={{
              labelCol: { span: 6, offset: 2, style: { lineHeight: 1.15 } },
              wrapperCol: { span: 15, offset: 0 },
            }}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "font-weight",
            })}
          />
          <AttributeField.ColorPickerField
            label={t("Text color")}
            path={path}
            name={`${props.name}.color`}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "color",
            })}
            formItem={{
              labelCol: { span: 6, offset: 2, style: { lineHeight: 1.15 } },
              wrapperCol: { span: 15, offset: 0 },
            }}
          />
          <AttributeField.ColorPickerField
            label={t("Button color")}
            path={path}
            name={`${props.name}.background-color`}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "background-color",
            })}
            formItem={{
              labelCol: { span: 7, offset: 1, style: { lineHeight: 1.15 } },
              wrapperCol: { span: 15, offset: 0 },
            }}
          />

          <AttributeField.FontSize
            label={t("Font size")}
            path={path}
            name={`${props.name}.font-size`}
            fallbackValue={getFallbackValue({
              mode: props.mode,
              defaultElement: defaultElement,
              name: "font-size",
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
          {!props.hidePadding && (
            <>
              <Divider />
              <AttributeField.Padding
                path={path}
                name={`${props.name}`}
                type={type}
              />
            </>
          )}
        </>
      </div>
    );
  }, [
    defaultElement,
    label,
    path,
    props.hidePadding,
    props.mode,
    props.name,
    type,
  ]);
}
