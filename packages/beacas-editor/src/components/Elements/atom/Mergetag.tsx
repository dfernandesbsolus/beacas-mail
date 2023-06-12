import { MergetagItem } from "@beacas-editor/components/BeacasEditorProvider";
import { Leaf } from "@beacas-editor/components/Leaf";
import { useEditorProps } from "@beacas-editor/hooks";
import { Element, MergetagElement, TextNode } from "beacas-core";
import React from "react";
import { BaseElement } from "../BaseElement";

import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.MERGETAG);

const getLabel = (mergetags: MergetagItem[], value: string) => {
  let label = value;

  const loop = (item: MergetagItem) => {
    if (item.value && item.value === value) {
      label = item.label;
    } else {
      item.children?.forEach(loop);
    }
  };
  mergetags.forEach(loop);

  return label;
};

export class Mergetag extends BaseElement<MergetagElement> {
  componentType = "Mergetag";

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderElement() {
    const child = this.props.element.children[0] as TextNode;

    return (
      <span {...this.props.attributes}>
        <MergeTagLabel
          value={child.text}
          children={this.props.children}
          element={this.props.element}
        />
      </span>
    );
  }
}

function MergeTagLabel({
  value,
  children,
  element,
}: {
  value: string;
  children: React.ReactNode;
  element: Element;
}) {
  const { mergetags } = useEditorProps();

  const matchLabel = mergetags ? getLabel(mergetags, value) : value;

  const child = element.children[0] as TextNode;
  return (
    <>
      <span
        style={{ position: "relative", display: "inline-block" }}
        className="text-mergetag"
      >
        <span
          style={{
            position: "absolute",
            width: "100%",
            display: "block",
            opacity: 0,
          }}
        >
          {children}
        </span>
        <Leaf text={child} leaf={child}>
          {matchLabel}
        </Leaf>
      </span>
    </>
  );
}
