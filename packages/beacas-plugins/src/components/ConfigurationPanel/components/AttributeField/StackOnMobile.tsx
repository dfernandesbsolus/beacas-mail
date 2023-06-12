import { Form, Switch } from "@arco-design/web-react";
import { useEditorForm } from "@beacas-plugins/hooks";
import {
  BlockManager,
  Element,
  ElementType,
  NodeUtils,
  StandardSectionElement,
  StandardType,
  t,
} from "beacas-core";
import React, { ComponentProps, useCallback, useMemo } from "react";
import { Node, Path } from "slate";
import { useSlate } from "slate-react";
import { AttributeField } from ".";

export function StackOnMobile(
  props: Omit<
    ComponentProps<typeof AttributeField.SwitchField>,
    "label" | "name"
  > & {
    label?: React.ReactNode;
    path: Path;
  }
) {
  const { label = t("Stack on mobile"), path, ...rest } = props;
  const editor = useSlate();
  const selectedNode = Node.get(editor, props.path) as StandardSectionElement;

  const { setFieldValue } = useEditorForm();

  const stackOnMobile =
    (selectedNode?.children[0] as Element)?.type !==
    StandardType.STANDARD_GROUP;

  const onChange = useCallback(
    (stackOnMobile: boolean) => {
      const firstChild = selectedNode?.children[0];
      const isGroup = firstChild && NodeUtils.isGroupElement(firstChild);
      const standardGroup = BlockManager.getBlockByType(
        ElementType.STANDARD_GROUP
      );
      if (stackOnMobile) {
        if (isGroup) {
          setFieldValue(props.path, "children", firstChild.children);
        }
      } else {
        if (isGroup) return;
        setFieldValue(props.path, "children", [
          standardGroup.create({
            attributes: {
              direction: selectedNode.attributes.direction,
              "vertical-align": selectedNode.attributes["vertical-align"],
            },
            mobileAttributes: {
              direction: selectedNode.mobileAttributes?.direction,
              "vertical-align":
                selectedNode.mobileAttributes?.["vertical-align"],
            },
            children: selectedNode?.children || [],
          }),
        ]);
      }
    },
    [
      props.path,
      selectedNode.attributes,
      selectedNode?.children,
      selectedNode.mobileAttributes,
      setFieldValue,
    ]
  );
  return useMemo(() => {
    return (
      <Form.Item
        label={label}
        labelCol={{ span: 11, offset: 1, style: { textAlign: "left" } }}
        wrapperCol={{ span: 10, offset: 0, style: { textAlign: "right" } }}
      >
        <Switch {...rest} checked={stackOnMobile} onChange={onChange} />
      </Form.Item>
    );
  }, [label, onChange, rest, stackOnMobile]);
}
