import { ButtonProps, Form, Space } from "@arco-design/web-react";
import { ButtonField } from "@beacas-plugins/components/Form";
import { italicAdapter } from "@beacas-plugins/components/Form/adapter";
import { IconFont } from "@beacas-plugins/components/IconFont";
import React, { ComponentProps, useMemo } from "react";
import { Path } from "slate";
import { AttributeField } from ".";

const renderItalicProps = (active: boolean): ButtonProps => {
  return active
    ? {
        icon: <IconFont iconName="icon-italic" />,
        type: "outline",
      }
    : {
        icon: <IconFont iconName="icon-italic" />,
      };
};

const renderUnderlineProps = (active: boolean): ButtonProps => {
  return active
    ? {
        icon: <IconFont iconName="icon-underline" />,
        type: "outline",
      }
    : {
        icon: <IconFont iconName="icon-underline" />,
      };
};

const underLineAdapter = {
  formatter(textDecoration: string): boolean {
    const val = textDecoration;

    return val === "underline";
  },
  normalize(active: boolean): string | undefined {
    if (!active) return undefined;

    return "underline";
  },
};

export function TextAndHeadingStyle(
  props: Omit<
    ComponentProps<typeof AttributeField.SelectField>,
    "label" | "options" | "name"
  > & {
    label?: React.ReactNode;
    path: Path;
    name: string;
  }
) {
  return useMemo(
    () => (
      <Form.Item
        label={<div />}
        style={{ marginBottom: 0 }}
        labelCol={{
          span: 8,
          offset: 0,
          style: { lineHeight: 1.15 },
        }}
        wrapperCol={{ span: 12 }}
      >
        <Space>
          <ButtonField
            path={props.path}
            label=""
            name={`${props.name}.font-style`}
            renderProps={renderItalicProps}
            formItem={{
              ...italicAdapter,
              style: { marginBottom: 0 },
            }}
          />

          <ButtonField
            path={props.path}
            label=""
            name={`${props.name}.text-decoration`}
            renderProps={renderUnderlineProps}
            formItem={{
              ...underLineAdapter,
              style: { marginBottom: 0 },
            }}
          />
        </Space>
      </Form.Item>
    ),
    [props.name, props.path]
  );
}
