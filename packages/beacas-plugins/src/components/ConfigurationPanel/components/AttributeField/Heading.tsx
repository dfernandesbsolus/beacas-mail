import { Form, Select } from "@arco-design/web-react";
import { useEditorForm } from "@beacas-plugins/hooks";
import { Element, ElementType, t } from "beacas-core";
import React, { ComponentProps, useCallback, useMemo } from "react";
import { Node, Path } from "slate";
import { useSlate } from "slate-react";
import { AttributeField } from ".";

const defaultOptions = [
  {
    value: ElementType.STANDARD_PARAGRAPH,
    label: t("Paragraph"),
  },
  {
    value: ElementType.STANDARD_H1,
    label: t("Heading 1"),
  },
  {
    value: ElementType.STANDARD_H2,
    label: t("Heading 2"),
  },
  {
    value: ElementType.STANDARD_H3,
    label: t("Heading 3"),
  },
  {
    value: ElementType.STANDARD_H4,
    label: t("Heading 4"),
  },
];

export function Heading(
  props: Omit<
    ComponentProps<typeof AttributeField.SwitchField>,
    "label" | "name"
  > & {
    label?: React.ReactNode;
    path: Path;
  }
) {
  const { label = t("Text type") } = props;
  const editor = useSlate();
  const { setFieldValue } = useEditorForm();
  const options = defaultOptions;

  const node = Node.get(editor, props.path) as Element;

  const onChange = useCallback(
    (type: Element["type"]) => {
      setFieldValue(props.path, "type", type);
    },
    [props.path, setFieldValue]
  );

  return useMemo(() => {
    return (
      <Form.Item label={label} {...props.formItem}>
        <Select options={options} value={node.type} onChange={onChange} />
      </Form.Item>
    );
  }, [label, node.type, onChange, options, props.formItem]);
}
