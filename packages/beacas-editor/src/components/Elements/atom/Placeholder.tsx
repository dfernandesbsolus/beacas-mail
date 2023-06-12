import { LineBreakElement } from "beacas-core";
import React from "react";
import { BaseElement } from "../BaseElement";

import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.PLACEHOLDER);

export class Placeholder extends BaseElement<LineBreakElement> {
  componentType = "Placeholder";

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderElement() {
    return this.renderWithColumn(
      <div
        style={{
          fontSize: 0,
          position: "absolute",
          opacity: 0,
          width: 0,
        }}
      >
        {this.renderChildrenWithPlaceholder()}
      </div>
    );
  }
}
