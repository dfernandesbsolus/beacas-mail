import { Form, Grid, Select } from "@arco-design/web-react";
import { useEditorForm, useElementDefault } from "@beacas-plugins/hooks";
import { Element, t } from "beacas-core";
import { get, isNumber } from "lodash";
import React, { ComponentProps, useCallback, useMemo, useState } from "react";
import { Node, Path } from "slate";
import { useSlate } from "slate-react";
import { AttributeField } from ".";

export function PixelAndPercentField(
  props: Omit<ComponentProps<typeof AttributeField.NumberField>, "label"> & {
    label: React.ReactNode;
    path: Path;
    defaultPixelValue?: string;
    defaultPercentValue?: string;
    disabled?: boolean;
    pxFirst?: boolean;
  }
) {
  const { label, defaultPixelValue, defaultPercentValue, pxFirst, ...rest } =
    props;
  const editor = useSlate();
  const { getFieldValue, setFieldValue } = useEditorForm();

  const source = Node.get(editor, props.path) as Element;
  const defaultElement = useElementDefault({
    path: props.path,
    type: get(source, "type", null) as Element["type"] | null,
  });

  const fallbackValue = props.fallbackValue || get(defaultElement, props.name);

  const value = getFieldValue(props.path, props.name) || fallbackValue;

  const getDefaultValue = () => {
    if (pxFirst) {
      return String(value).indexOf("%") > -1 ? "%" : "px";
    }
    return String(value).indexOf("px") > -1 ? "px" : "%";
  };

  const [unit, setUnit] = useState(getDefaultValue());

  const onChangeUnit = useCallback(
    (unit: string) => {
      if (unit === "px") {
        setFieldValue(props.path, props.name, props.defaultPixelValue);
      } else {
        setFieldValue(props.path, props.name, props.defaultPercentValue);
      }
      setUnit(unit);
    },
    [
      props.defaultPercentValue,
      props.defaultPixelValue,
      props.name,
      props.path,
      setFieldValue,
    ]
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
            {...rest}
            label={label}
            formItem={{
              ...adapter,
              disabled: props.disabled,
              labelCol: {
                span: 10,
                offset: 2,
              },
              wrapperCol: {
                span: 12,
              },
              ...props.formItem,
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
            <Select
              disabled={props.disabled}
              value={unit}
              onChange={onChangeUnit}
            >
              <Select.Option value="px">{t("px")}</Select.Option>
              <Select.Option value="">{t("%")}</Select.Option>
            </Select>
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
    );
  }, [label, onChangeUnit, props.disabled, props.formItem, rest, unit]);
}
