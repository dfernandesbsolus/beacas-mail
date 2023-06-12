import { SpacerElement, Element, ElementType, BlockManager } from "beacas-core";
import React from "react";

const block = BlockManager.getBlockByType(ElementType.SPACER);

import { BaseElement } from "../BaseElement";
export class Spacer<T extends Element = SpacerElement> extends BaseElement<T> {
  componentType = "spacer";
  static allowedAttributes = {
    border: "string",
    "border-bottom": "string",
    "border-left": "string",
    "border-right": "string",
    "border-top": "string",
    "container-background-color": "color",
    "padding-bottom": "unit(px,%)",
    "padding-left": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-top": "unit(px,%)",
    padding: "unit(px,%){1,4}",
    height: "unit(px,%)",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getStyles() {
    return {
      div: {
        height: this.getAttribute("height"),
        "line-height": this.getAttribute("height"),
      },
    };
  }

  renderWithColumn = (children: React.ReactNode) => {
    return (
      <tr {...this.props.attributes} data-slate-block={this.componentType}>
        <td
          {...this.htmlAttributes({
            align: this.getAttribute("align"),
            "vertical-align": this.getAttribute("vertical-align"),
            class: this.getAttribute("css-class"),
            style: {
              background: this.getAttribute("container-background-color"),
              "font-size": "0px",
              padding: this.getAttribute("padding"),
              "padding-top": this.getAttribute("padding-top"),
              "padding-right": this.getAttribute("padding-right"),
              "padding-bottom": this.getAttribute("padding-bottom"),
              "padding-left": this.getAttribute("padding-left"),
              "word-break": "break-word",
              width: "100%",
            },
          })}
        >
          {children}
        </td>
      </tr>
    );
  };

  renderElement() {
    return this.renderWithColumn(
      <div
        {...this.props.attributes}
        {...this.htmlAttributes({
          style: "div",
        })}
      >
        {this.renderChildrenWithPlaceholder()}
      </div>
    );
  }
}
