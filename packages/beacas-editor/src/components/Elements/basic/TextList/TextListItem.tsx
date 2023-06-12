import { StandardTextListItemElement } from "beacas-core";
import React from "react";

import { BaseElement } from "../../BaseElement";

export class TextListItem extends BaseElement<StandardTextListItemElement> {
  componentType = "text-list";
  renderElement(): React.ReactNode | undefined {
    return (
      <li {...this.props.attributes}>{this.renderChildrenWithPlaceholder()}</li>
    );
  }
}
