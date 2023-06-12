import { Button, Form, Grid } from "@arco-design/web-react";
import { IconLock, IconUnlock } from "@arco-design/web-react/icon";
import { pixelNumberAdapter } from "@beacas-plugins/components/Form/adapter";
import { Element, t, TextElement } from "beacas-core";
import { get } from "lodash";
import React, { useMemo, useState } from "react";
import { Path } from "slate";
import { AttributeField } from ".";
import { useElementDefault } from "@beacas-plugins/hooks";

export function Padding(props: {
  name: string;
  label?: React.ReactNode;
  path: Path;
  type?: Element["type"];
  fieldName?: string;
}) {
  const { label = t("Padding"), fieldName = "padding" } = props;
  const element = useElementDefault({
    path: props.path,
    type: props.type || null,
  });

  return useMemo(() => {
    return (
      <Grid.Row>
        <Grid.Col span={7} style={{ textAlign: "right" }}>
          <span>{label}</span>
        </Grid.Col>
        <Grid.Col span={16} offset={1}>
          <PaddingRow
            {...props}
            fieldName={fieldName}
            direction="vertical"
            element={element}
          />
          <PaddingRow
            {...props}
            fieldName={fieldName}
            direction="horizontal"
            element={element}
          />
        </Grid.Col>
      </Grid.Row>
    );
  }, [element, fieldName, label, props]);
}

const PaddingRow = (props: {
  name: string;
  label?: React.ReactNode;
  path: Path;
  element: Pick<TextElement, "attributes" | "mobileAttributes">;
  direction: "vertical" | "horizontal";
  fieldName: string;
}) => {
  const { path, element, direction, fieldName } = props;

  const firstFieldName =
    direction === "vertical"
      ? `${props.name}.${fieldName}-top`
      : `${props.name}.${fieldName}-left`;

  const secondFieldName =
    direction === "vertical"
      ? `${props.name}.${fieldName}-bottom`
      : `${props.name}.${fieldName}-right`;

  const [isLock, setIsLock] = useState(
    get(element, firstFieldName) === get(element, secondFieldName)
  );

  const firstFieldLabel = direction === "vertical" ? t("Top") : t("Left");
  const secondFieldLabel = direction === "vertical" ? t("Bottom") : t("Right");

  const defaultAttributes = element?.[
    props.name.includes("mobileAttributes") ? "mobileAttributes" : "attributes"
  ] as Record<string, string> | undefined;
  if (isLock) {
    return (
      <Grid.Row>
        <Grid.Col span={17}>
          <AttributeField.NumberField
            suffix={t("px")}
            label={firstFieldLabel + " / " + secondFieldLabel}
            path={path}
            name={firstFieldName}
            formItem={{
              ...pixelNumberAdapter,
              labelCol: { span: 0, offset: 0 },
              wrapperCol: { span: 24, offset: 0 },
              layout: "vertical",
            }}
            fallbackValue={
              direction === "vertical"
                ? defaultAttributes?.[`${fieldName}-top`]
                : defaultAttributes?.[`${fieldName}-left`]
            }
          />
          <AttributeField.WatchField
            name={secondFieldName}
            watchFieldName={firstFieldName}
            path={props.path}
            sync
          />
        </Grid.Col>
        <Grid.Col span={6} offset={1}>
          <Form.Item layout="vertical" label={<div>&emsp;</div>}>
            <Button
              onClick={() => setIsLock((v) => !v)}
              icon={<IconLock />}
            ></Button>
          </Form.Item>
        </Grid.Col>
      </Grid.Row>
    );
  }

  return (
    <Grid.Row>
      <Grid.Col span={8}>
        <AttributeField.NumberField
          suffix={t("px")}
          label={firstFieldLabel}
          path={path}
          name={firstFieldName}
          formItem={{
            ...pixelNumberAdapter,
            labelCol: { span: 0, offset: 0 },
            wrapperCol: { span: 24, offset: 0 },
            layout: "vertical",
          }}
          fallbackValue={
            direction === "vertical"
              ? defaultAttributes?.[`${fieldName}-top`]
              : defaultAttributes?.[`${fieldName}-left`]
          }
        />
      </Grid.Col>
      <Grid.Col span={8} offset={1}>
        <AttributeField.NumberField
          suffix={t("px")}
          label={secondFieldLabel}
          path={path}
          name={secondFieldName}
          formItem={{
            ...pixelNumberAdapter,
            labelCol: { span: 0, offset: 0 },
            wrapperCol: { span: 24, offset: 0 },
            layout: "vertical",
          }}
          fallbackValue={
            direction === "vertical"
              ? defaultAttributes?.[`${fieldName}-bottom`]
              : defaultAttributes?.[`${fieldName}-right`]
          }
        />
      </Grid.Col>
      <Grid.Col span={6} offset={1}>
        <Form.Item layout="vertical" label={<div>&emsp;</div>}>
          <Button
            onClick={() => setIsLock((v) => !v)}
            icon={<IconUnlock />}
          ></Button>
        </Form.Item>
      </Grid.Col>
    </Grid.Row>
  );
};
