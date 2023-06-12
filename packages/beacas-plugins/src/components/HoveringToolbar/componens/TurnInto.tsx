import { NodeUtils, Element, StandardType, t } from "beacas-core";
import { Select } from "@arco-design/web-react";
import React from "react";
import { Editor, Transforms } from "slate";
import { useSlate } from "slate-react";
import paragraphIcon from "@beacas-plugins/assets/images/elements/paragraph.png";
import heading1 from "@beacas-plugins/assets/images/elements/heading1.png";
import heading2 from "@beacas-plugins/assets/images/elements/heading2.png";
import heading3 from "@beacas-plugins/assets/images/elements/heading3.png";

const options = [
  {
    icon: paragraphIcon,
    get content() {
      return t("Paragraph");
    },
    value: StandardType.STANDARD_PARAGRAPH,
  },
  {
    icon: heading1,
    get content() {
      return t("Heading 1");
    },
    value: StandardType.STANDARD_H1,
  },
  {
    icon: heading2,
    get content() {
      return t("Heading 2");
    },
    value: StandardType.STANDARD_H2,
  },
  {
    icon: heading3,
    get content() {
      return t("Heading 3");
    },
    value: StandardType.STANDARD_H3,
  },
  {
    icon: heading3,
    get content() {
      return t("Heading 4");
    },
    value: StandardType.STANDARD_H4,
  },
];

export const TurnInto = () => {
  const editor = useSlate();

  const nodeEntry = Editor.above(editor, {
    match: NodeUtils.isBlockElement,
  });
  const node = nodeEntry?.[0] as Element;

  const onChange = (value: Element["type"]) => {
    Transforms.setNodes(
      editor,
      {
        type: value as any,
      },
      {
        at: nodeEntry![1],
      }
    );
    Transforms.collapse(editor);
  };

  if (!NodeUtils.isElement(node)) return null;

  return (
    <>
      <Select
        value={node.type}
        className={"TurnInto"}
        style={{ minWidth: 95 }}
        onChange={onChange}
        renderFormat={(option: any) => {
          const matchItem = options.find((o) => o.value === option?.value);
          return (
            <span className="TurnInto-content">
              {matchItem ? matchItem.content : ""}
            </span>
          );
        }}
        triggerProps={{
          autoAlignPopupWidth: false,
          autoAlignPopupMinWidth: true,
        }}
      >
        {options.map((option, index) => {
          return (
            <Select.Option key={index} value={option.value}>
              <div className="TurnInto-item">
                <img src={option.icon} alt="" className="TurnInto-icon" />
                <span className="TurnInto-content">{option.content}</span>
              </div>
            </Select.Option>
          );
        })}
      </Select>
      <style>{`.TurnInto .arco-select-view { border: none; }`}</style>
    </>
  );
};
