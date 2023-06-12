import { isNil } from "lodash";
import React from "react";
import { BlockManager, ElementType, SocialElement } from "beacas-core";

import { BaseElement } from "../BaseElement";

const block = BlockManager.getBlockByType(ElementType.SOCIAL);

export class Social extends BaseElement<SocialElement> {
  componentType = "social";

  static allowedAttributes = {
    align: "enum(left,right,center)",
    "border-radius": "unit(px,%)",
    "container-background-color": "color",
    color: "color",
    "font-family": "string",
    "font-size": "unit(px)",
    "font-style": "string",
    "font-weight": "string",
    "icon-size": "unit(px,%)",
    "icon-height": "unit(px,%)",
    "icon-padding": "unit(px,%){1,4}",
    "inner-padding": "unit(px,%){1,4}",
    "line-height": "unit(px,%,)",
    mode: "enum(horizontal,vertical)",
    "padding-bottom": "unit(px,%)",
    "padding-left": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-top": "unit(px,%)",
    padding: "unit(px,%){1,4}",
    "table-layout": "enum(auto,fixed)",
    "text-padding": "unit(px,%){1,4}",
    "text-decoration": "string",
    "vertical-align": "enum(top,bottom,middle)",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getStyles() {
    return {
      tableVertical: {
        margin: "0px",
      },
    };
  }

  getSocialElementAttributes() {
    const base: Record<string, string> = {};
    if (this.getAttribute("inner-padding")) {
      base.padding = this.getAttribute("inner-padding");
    }

    return [
      "border-radius",
      "color",
      "font-family",
      "font-size",
      "font-weight",
      "font-style",
      "icon-size",
      "icon-height",
      "icon-padding",
      "text-padding",
      "line-height",
      "text-decoration",
    ]
      .filter((e) => !isNil(this.getAttribute(e)))
      .reduce((res, attr) => {
        res[attr] = this.getAttribute(attr);
        return res;
      }, base);
  }

  get isHorizontal() {
    return this.getAttribute("mode") === "horizontal";
  }

  renderVertical() {
    return (
      <table
        {...this.htmlAttributes({
          border: "0",
          cellpadding: "0",
          cellspacing: "0",
          role: "presentation",
          style: "tableVertical",
        })}
      >
        <tbody>{this.renderChildrenWithPlaceholder()}</tbody>
      </table>
    );
  }

  renderChildrenWithPlaceholder() {
    return (
      <>
        {this.props.children}
        {this.props.placeholder}
      </>
    );
  }

  renderHorizontal() {
    return this.renderChildrenWithPlaceholder();
  }

  renderElement() {
    return this.renderWithColumn(
      this.isHorizontal ? this.renderHorizontal() : this.renderVertical()
    );
  }
}
