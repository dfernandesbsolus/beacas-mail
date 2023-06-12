import {
  BlockManager,
  ElementType,
  StandardTextListElement,
} from "beacas-core";
import React from "react";

import { Text as AtomText } from "../../atom";

const block = BlockManager.getBlockByType(ElementType.TEXT);
export class TextList extends AtomText<StandardTextListElement> {
  static allowedAttributes = {
    ...AtomText.allowedAttributes,
    "list-style": "string",
  };

  static defaultAttributes = {
    ...AtomText.defaultAttributes,
    ...block.defaultData.attributes,
  };

  renderElement(): React.ReactNode | undefined {
    return this.renderWithColumn(
      <div
        {...this.htmlAttributes({
          style: "text",
        })}
      >
        {this.attributes["list-style"] === "number" ? (
          <ol>{this.renderChildrenWithPlaceholder()}</ol>
        ) : (
          <ul>{this.renderChildrenWithPlaceholder()}</ul>
        )}
      </div>
    );
  }
}
