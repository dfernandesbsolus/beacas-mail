import { LineBreakElement } from "beacas-core";
import React from "react";
import { BaseElement } from "../BaseElement";

import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.LINE_BREAK);

export class LineBreak extends BaseElement<LineBreakElement> {
  componentType = "LineBreak";

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderElement() {
    return (
      <div {...this.props.attributes}>
        <span
          style={{ fontSize: 0, position: "absolute", opacity: 0, width: 0 }}
        >
          {this.props.children}
        </span>
      </div>
    );
  }
}
