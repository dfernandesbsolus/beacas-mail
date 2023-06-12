import { t } from "beacas-core";
import React, { ComponentProps, useCallback, useEffect, useMemo } from "react";
import { AttributeField } from ".";
import { useEditorForm } from "@beacas-plugins/hooks";
import { Path } from "slate";
import { Form, Grid, Radio } from "@arco-design/web-react";

export function ImageWidth(
  props: Omit<
    ComponentProps<typeof AttributeField.ButtonGroupField>,
    "label" | "options"
  > & {
    label?: React.ReactNode;
    path: Path;
  }
) {
  const { label = t("Width") } = props;
  const { getFieldValue, setFieldValue } = useEditorForm();

  const value = getFieldValue(props.path, props.name);
  const [widthType, setWidthType] = React.useState<"Fixed" | "Full">(
    value === undefined ? "Full" : "Fixed"
  );

  const onChangeWidthType = useCallback(
    (val: "Fixed" | "Full") => {
      setWidthType(val);
      if (val === "Full") {
        setFieldValue(props.path, props.name, undefined);
      }
    },
    [props.name, props.path, setFieldValue]
  );

  useEffect(() => {
    if (value === undefined) {
      setWidthType("Full");
    } else {
      setWidthType("Fixed");
    }
  }, [value]);

  return useMemo(() => {
    return (
      <>
        <Form.Item
          label={label}
          style={{ width: "100%" }}
          labelCol={{
            span: 7,
            offset: 1,
            style: { lineHeight: 1.15 },
          }}
          wrapperCol={{ span: 14 }}
        >
          <Radio.Group
            value={widthType}
            type="button"
            options={[
              { label: t("Fixed"), value: "Fixed" },
              { label: t("Full width"), value: "Full" },
            ]}
            onChange={onChangeWidthType}
          ></Radio.Group>
        </Form.Item>
        <Grid.Row>
          <Grid.Col span={24} offset={0}>
            {widthType === "Fixed" && (
              <AttributeField.PixelAndPercentField
                path={props.path}
                name={props.name}
                label={<></>}
                pxFirst
              />
            )}
          </Grid.Col>
        </Grid.Row>
      </>
    );
  }, [label, onChangeWidthType, props.name, props.path, widthType]);
}
