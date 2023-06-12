import React from "react";
import { Column as AtomColumn } from "../atom";
import { BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.COLUMN);

export class Column extends AtomColumn {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  renderColumn() {
    return (
      <table
        {...this.htmlAttributes({
          border: "0",
          cellpadding: "0",
          cellspacing: "0",
          role: "presentation",
          style: "table",
          width: "100%",
        })}
      >
        <tbody>{this.renderChildrenWithPlaceholder()}</tbody>
      </table>
    );
  }
}
