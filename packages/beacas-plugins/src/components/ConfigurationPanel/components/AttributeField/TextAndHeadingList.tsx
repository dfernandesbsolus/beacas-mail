import { Divider, Grid, Radio, Space } from "@arco-design/web-react";
import { Element, ElementType, t, TextElement } from "beacas-core";
import { ActiveTabKeys } from "beacas-editor";
import React, { useMemo, useState } from "react";
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

const elements = [
  { value: ElementType.STANDARD_PARAGRAPH, label: "Paragraph" },
  { value: ElementType.STANDARD_H1, label: "H1" },
  { value: ElementType.STANDARD_H2, label: "H2" },
  { value: ElementType.STANDARD_H3, label: "H3" },
  { value: ElementType.STANDARD_H4, label: "H4" },
];

const path = [0];
export function TextAndHeadingList() {
  const [tab, setTab] = useState<Element["type"]>(
    ElementType.STANDARD_PARAGRAPH
  );
  const element = useElementDefault<TextElement>({
    type: tab,
    path: path,
  });

  return useMemo(() => {
    return (
      <Space direction="vertical">
        <Grid.Row justify="center">
          <Radio.Group type="button" value={tab} onChange={setTab}>
            {elements.map((item) => {
              return (
                <Radio
                  key={item.value}
                  style={{ minWidth: 65, textAlign: "center" }}
                  value={item.value}
                >
                  <Space>{item.label}</Space>
                </Radio>
              );
            })}
          </Radio.Group>
        </Grid.Row>
        <div />
        <AttributeField.Typography
          mode={ActiveTabKeys.DESKTOP}
          type={tab}
          name={`data.blockAttributes.${tab}`}
          path={path}
          defaultElement={element}
        />
        <AttributeField.TextAlign
          name={`data.blockAttributes.${tab}.align`}
          path={path}
          fallbackValue={element.attributes.align}
        />
        <Divider />
        <AttributeField.Padding
          path={path}
          name={`data.blockAttributes.${tab}`}
          type={tab}
        />
      </Space>
    );
  }, [element, tab]);
}
