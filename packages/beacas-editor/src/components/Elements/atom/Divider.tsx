import { widthParser } from "@beacas-editor/utils/widthParser";
import {
  BlockManager,
  DividerElement,
  Element,
  ElementType,
} from "beacas-core";
import React from "react";

const block = BlockManager.getBlockByType(ElementType.DIVIDER);

import { BaseElement } from "../BaseElement";
export class Divider<
  T extends Element = DividerElement
> extends BaseElement<T> {
  componentType = "divider";

  static allowedAttributes = {
    "border-color": "color",
    "border-style": "string",
    "border-width": "unit(px)",
    "container-background-color": "color",
    padding: "unit(px,%){1,4}",
    "padding-bottom": "unit(px,%)",
    "padding-left": "unit(px,%)",
    "padding-right": "unit(px,%)",
    "padding-top": "unit(px,%)",
    width: "unit(px,%)",
    align: "enum(left,center,right)",
  };

  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getStyles() {
    let computeAlign = "0px auto";
    if (this.getAttribute("align") === "left") {
      computeAlign = "0px";
    } else if (this.getAttribute("align") === "right") {
      computeAlign = "0px 0px 0px auto";
    }
    const p = {
      "border-top": ["style", "width", "color"]
        .map((attr) => this.getAttribute(`border-${attr}`))
        .join(" "),
      "font-size": "1px",
      "line-height": "0px",
      margin: computeAlign,
      width: this.getAttribute("width"),
    };

    return {
      p,
      outlook: {
        ...p,
        width: this.getOutlookWidth(),
      },
    };
  }

  getOutlookWidth() {
    const { containerWidth } = this.parent;
    const paddingSize =
      this.getShorthandAttrValue("padding", "left") +
      this.getShorthandAttrValue("padding", "right");

    const width = this.getAttribute("width");

    const { parsedWidth, unit } = widthParser(width);

    switch (unit) {
      case "%": {
        const effectiveWidth = parseInt(containerWidth, 10) - paddingSize;
        const percentMultiplier = parseInt(parsedWidth.toString(), 10) / 100;
        return `${effectiveWidth * percentMultiplier}px`;
      }
      case "px":
        return width;
      default:
        return `${parseInt(containerWidth, 10) - paddingSize}px`;
    }
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
      <p
        {...this.htmlAttributes({
          style: "p",
        })}
      >
        {this.renderChildrenWithPlaceholder()}
      </p>
    );
  }
}
