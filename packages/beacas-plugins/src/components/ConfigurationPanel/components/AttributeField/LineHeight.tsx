import { Form, Grid, Select } from "@arco-design/web-react";
import { useEditorForm, useElementDefault } from "@beacas-plugins/hooks";
import { Element, t } from "beacas-core";
import { get, isNumber } from "lodash";
import React, { ComponentProps, useCallback, useMemo } from "react";
import { Node, Path } from "slate";
import { useSlate } from "slate-react";
import { AttributeField } from ".";

export function LineHeight(
  props: Omit<ComponentProps<typeof AttributeField.NumberField>, "label"> & {
    label?: React.ReactNode;
    path: Path;
  }
) {
  const { label = t("Line height") } = props;
  const editor = useSlate();
  const { getFieldValue, setFieldValue } = useEditorForm();

  const source = Node.get(editor, props.path);
  const defaultElement = useElementDefault({
    path: props.path,
    type: get(source, "type", null) as Element["type"] | null,
  });

  const fallbackValue = props.fallbackValue || get(defaultElement, props.name);

  const value = getFieldValue(props.path, props.name) || fallbackValue;
  const fontSize =
    (
      getFieldValue(props.path, "font-size") ||
      get(defaultElement, props.name.replace("line-height", "font-size"))
    )?.replace("px", "") || 16;

  const unit = String(value).indexOf("px") > -1 ? "px" : "%";
  const onChangeUnit = useCallback(
    (unit: string) => {
      if (unit === "px") {
        const val = value.toString()?.replace("%", "") || "100";

        setFieldValue(
          props.path,
          props.name,
          `${((+val / 100) * fontSize).toFixed(0)}px`
        );
      } else {
        const val = value.toString()?.replace("px", "");
        if (val) {
          setFieldValue(
            props.path,
            props.name,
            ((val / fontSize) * 100).toFixed(0) + "%"
          );
        } else {
          setFieldValue(props.path, props.name, "120%");
        }
      }
    },
    [fontSize, props.name, props.path, setFieldValue, value]
  );

  return useMemo(() => {
    const adapter = {
      formatter(val: string) {
        if (!val) return undefined;
        val = val.toString();

        return +val.replace("px", "")?.replace("%", "");
      },
      normalize(val: string) {
        if (!isNumber(val)) return undefined;
        if (!val) return undefined;
        return val + unit;
      },
    };

    return (
      <Grid.Row>
        <Grid.Col span={16} style={{ textAlign: "right" }}>
          <AttributeField.NumberField
            {...props}
            label={label}
            formItem={{
              ...adapter,
              ...props.formItem,
              labelCol: {
                span: 10,
                offset: 2,
              },
              wrapperCol: {
                span: 12,
              },
            }}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Form.Item
            labelCol={{
              span: 0,
              style: { lineHeight: 1.15 },
            }}
            wrapperCol={{ span: 24 }}
          >
            <Select value={unit} onChange={onChangeUnit}>
              <Select.Option value="">{t("%")}</Select.Option>
              <Select.Option value="px">{t("px")}</Select.Option>
            </Select>
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
    );
  }, [label, onChangeUnit, props, unit]);
}
