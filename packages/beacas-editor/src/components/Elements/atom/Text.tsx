import React from "react";
import { BlockManager, Element, ElementType, TextElement } from "beacas-core";

import { BaseElement } from "../BaseElement";

const block = BlockManager.getBlockByType(ElementType.TEXT);

export class Text<T extends Element = TextElement> extends BaseElement<T> {
  componentType = "text";

  static endingTag = true;

  static allowedAttributes = {
    align: "enum(left,right,center,justify)",
    "background-color": "color",
    color: "color",
    "container-background-color": "color",
    "font-family": "string",
    "font-size": "unit(px)",
    "font-style": "string",
    "font-weight": "string",
    height: "unit(px,%)",
    "letter-spacing": "unitWithNegative(px,em)",
    "line-height": "unit(px,%,)",
    "padding-bottom": "unit(px,%)",
    "padding-left": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-top": "unit(px,%)",
    padding: "unit(px,%){1,4}",
    "text-decoration": "string",
    "text-transform": "string",
    "vertical-align": "enum(top,bottom,middle)",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getStyles() {
    return {
      text: {
        "font-family": this.getAttribute("font-family"),
        "font-size": this.getAttribute("font-size"),
        "font-style": this.getAttribute("font-style"),
        "font-weight": this.getAttribute("font-weight"),
        "letter-spacing": this.getAttribute("letter-spacing"),
        "line-height": this.getAttribute("line-height"),
        "text-align": this.getAttribute("align"),
        "text-decoration": this.getAttribute("text-decoration"),
        "text-transform": this.getAttribute("text-transform"),
        color: this.getAttribute("color"),
        height: this.getAttribute("height"),
      },
    };
  }

  renderElement(): React.ReactNode {
    return this.renderWithColumn(
      <div
        {...this.htmlAttributes({
          style: "text",
        })}
      >
        {this.renderChildrenWithPlaceholder()}
      </div>
    );
  }
}
