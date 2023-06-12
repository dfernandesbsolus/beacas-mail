import { Element, ElementType, BlockManager, RawElement } from "beacas-core";
import React from "react";

const block = BlockManager.getBlockByType(ElementType.RAW);

import { BaseElement } from "../BaseElement";
import { HtmlStringToReactNodes } from "@beacas-editor/components/HtmlStringToReactNodes";

export class Raw<T extends Element = RawElement> extends BaseElement<T> {
  componentType = "raw";

  static allowedAttributes = {};

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderElement(): React.ReactNode {
    return (
      <HtmlStringToReactNodes
        content={(this.props.element as RawElement).data.content}
        domAttributes={{ contentEditable: false }}
      >
        {this.renderChildrenWithPlaceholder()}
      </HtmlStringToReactNodes>
    );
  }
}
