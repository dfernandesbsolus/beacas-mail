import { ButtonProps, Form, Space } from "@arco-design/web-react";
import { ButtonField } from "@beacas-plugins/components/Form";
import { italicAdapter } from "@beacas-plugins/components/Form/adapter";
import { IconFont } from "@beacas-plugins/components/IconFont";
import { t } from "beacas-core";
import React, { useMemo } from "react";
import { AttributeField } from ".";

const path = [0];

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

export function GlobalLink() {
  return useMemo(() => {
    return (
      <>
        <AttributeField.ColorPickerField
          name={"attributes.link-color"}
          label={t("Color")}
          path={path}
        />

        <AttributeField.FontWeight
          label={t("Style")}
          path={path}
          name={"attributes.link-font-weight"}
        />
        <Form.Item
          label={<div />}
          labelCol={{
            span: 8,
            offset: 0,
            style: { lineHeight: 1.15 },
          }}
          wrapperCol={{ span: 12 }}
        >
          <Space>
            <ButtonField
              path={path}
              label=""
              name={`attributes.link-font-style`}
              renderProps={renderItalicProps}
              formItem={italicAdapter}
            />

            <ButtonField
              path={path}
              label=""
              name={`attributes.link-text-decoration`}
              renderProps={renderUnderlineProps}
              formItem={underLineAdapter}
            />
          </Space>
        </Form.Item>
      </>
    );
  }, []);
}
