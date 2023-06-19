import React from "react";
import { Divider as AtomDivider } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.DIVIDER);

export class Divider extends AtomDivider {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderElement() {
    const attributes = this.htmlAttributes({
      style: "p",
    }) as any;

    return this.renderWithColumn(
      <div
        {...attributes}
        style={{
          ...attributes.style,
          position: "relative",
        }}
      >
        {this.renderChildrenWithPlaceholder()}
      </div>
    );
  }
}
